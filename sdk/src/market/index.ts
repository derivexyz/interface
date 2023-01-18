import { BigNumber } from '@ethersproject/bignumber'
import { PopulatedTransaction } from '@ethersproject/contracts'
import { Block } from '@ethersproject/providers'
import { parseBytes32String } from '@ethersproject/strings'

import { Board, BoardQuotes } from '../board'
import { ZERO_BN } from '../constants/bn'
import { DataSource } from '../constants/contracts'
import { SnapshotOptions } from '../constants/snapshots'
import {
  BoardViewStructOutput,
  MarketParametersStructOutput,
  MarketViewWithBoardsStructOutput,
} from '../constants/views'
import { OptionMarketViewer as OptionMarketViewerAvalon } from '../contracts/avalon/typechain'
import { OptionMarketViewer } from '../contracts/newport/typechain'
import { LiquidityDeposit } from '../liquidity_deposit'
import { LiquidityWithdrawal } from '../liquidity_withdrawal'
import Lyra, { Version } from '../lyra'
import { Option } from '../option'
import { Quote, QuoteOptions } from '../quote'
import { Strike } from '../strike'
import { Trade, TradeOptions } from '../trade'
import fetchLatestLiquidity from '../utils/fetchLatestLiquidity'
import fetchLatestNetGreeks from '../utils/fetchLatestNetGreeks'
import fetchLiquidityHistory from '../utils/fetchLiquidityHistory'
import fetchMarketAddresses from '../utils/fetchMarketAddresses'
import fetchMarketView from '../utils/fetchMarketView'
import fetchNetGreeksHistory from '../utils/fetchNetGreeksHistory'
import fetchSpotPriceHistory from '../utils/fetchSpotPriceHistory'
import fetchTradingVolumeHistory from '../utils/fetchTradingVolumeHistory'
import findMarket from '../utils/findMarket'
import getBoardView from '../utils/getBoardView'
import getBoardViewForStrikeId from '../utils/getBoardViewForStrikeId'
import getMarketOwner from '../utils/getMaketOwner'
import getMarketName from '../utils/getMarketName'

export type MarketToken = {
  address: string
  symbol: string
  decimals: number
}

export type MarketContractAddresses = {
  liquidityPool: string
  liquidityToken: string
  greekCache: string
  optionMarket: string
  optionMarketPricer: string
  optionToken: string
  shortCollateral: string
  poolHedger: string
}

export type MarketLiquiditySnapshot = {
  tvl: BigNumber
  freeLiquidity: BigNumber
  burnableLiquidity: BigNumber
  utilization: number
  reservedCollatLiquidity: BigNumber
  pendingDeltaLiquidity: BigNumber
  usedDeltaLiquidity: BigNumber
  tokenPrice: BigNumber
  pendingDeposits: BigNumber
  pendingWithdrawals: BigNumber
  timestamp: number
}

export type MarketNetGreeksSnapshot = {
  poolNetDelta: BigNumber
  hedgerNetDelta: BigNumber
  netDelta: BigNumber
  netStdVega: BigNumber
  timestamp: number
}

export type MarketTradingVolumeSnapshot = {
  premiumVolume: BigNumber
  notionalVolume: BigNumber
  vaultFees: BigNumber
  vaultFeeComponents: {
    spotPriceFees: BigNumber
    optionPriceFees: BigNumber
    vegaUtilFees: BigNumber
    varianceFees: BigNumber
    forceCloseFees: BigNumber
    liquidationFees: BigNumber
  }
  totalPremiumVolume: BigNumber
  totalNotionalVolume: BigNumber
  liquidatorFees: BigNumber
  smLiquidationFees: BigNumber
  startTimestamp: number
  endTimestamp: number
}

export type MarketSpotCandle = {
  period: number
  open: BigNumber
  high: BigNumber
  low: BigNumber
  close: BigNumber
  startTimestamp: number
  startBlockNumber: number
  endTimestamp: number
}

export type MarketQuotes = {
  boards: BoardQuotes[]
  market: Market
}
export type MarketTradeOptions = Omit<TradeOptions, 'minOrMaxPremium' | 'premiumSlippage'>

export class Market {
  private liveBoardsMap: Record<number, BoardViewStructOutput>
  __source = DataSource.ContractCall
  __marketData: MarketViewWithBoardsStructOutput
  lyra: Lyra
  block: Block
  address: string
  name: string
  quoteToken: MarketToken
  baseToken: MarketToken
  liquidityToken: MarketToken
  tradingCutoff: number
  isPaused: boolean
  openInterest: BigNumber
  spotPrice: BigNumber
  depositDelay: number
  withdrawalDelay: number
  contractAddresses: MarketContractAddresses
  marketParameters: MarketParametersStructOutput

  constructor(lyra: Lyra, marketView: MarketViewWithBoardsStructOutput, block: Block) {
    this.lyra = lyra
    this.block = block
    this.__marketData = marketView
    this.marketParameters = marketView.marketParameters

    const fields = Market.getFields(lyra.version, marketView)
    this.address = fields.address

    this.isPaused = fields.isPaused
    this.spotPrice = fields.spotPrice
    this.quoteToken = fields.quoteToken
    this.baseToken = fields.baseToken
    this.liquidityToken = fields.liquidityToken
    this.tradingCutoff = fields.tradingCutoff
    this.name = fields.name
    this.contractAddresses = fields.contractAddresses
    this.openInterest = this.liveBoards().reduce((sum, board) => {
      const strikes = board.strikes()
      const longCallOpenInterest = strikes.reduce((sum, strike) => sum.add(strike.call().longOpenInterest), ZERO_BN)
      const shortCallOpenInterest = strikes.reduce((sum, strike) => sum.add(strike.call().shortOpenInterest), ZERO_BN)
      const longPutOpenInterest = strikes.reduce((sum, strike) => sum.add(strike.put().longOpenInterest), ZERO_BN)
      const shortPutOpenInterest = strikes.reduce((sum, strike) => sum.add(strike.put().shortOpenInterest), ZERO_BN)
      return sum.add(longCallOpenInterest).add(shortCallOpenInterest).add(longPutOpenInterest).add(shortPutOpenInterest)
    }, ZERO_BN)
    this.depositDelay = fields.depositDelay
    this.withdrawalDelay = fields.withdrawalDelay
    const liveBoards: Array<BoardViewStructOutput> = marketView.liveBoards
    this.liveBoardsMap = liveBoards.reduce(
      (map, boardView) => ({
        ...map,
        [boardView.boardId.toNumber()]: boardView,
      }),
      {}
    )
  }

  // TODO: @dappbeast Remove getFields
  private static getFields(version: Version, marketView: MarketViewWithBoardsStructOutput) {
    const address = marketView.marketAddresses.optionMarket
    const isPaused = marketView.isPaused
    let spotPrice, quoteSymbol, baseSymbol, quoteDecimals, baseDecimals
    if (version === Version.Avalon) {
      const avalonMarketView = marketView as OptionMarketViewerAvalon.MarketViewWithBoardsStructOutput
      spotPrice = avalonMarketView.exchangeParams.spotPrice
      quoteSymbol = parseBytes32String(avalonMarketView.exchangeParams.quoteKey)
      baseSymbol = parseBytes32String(avalonMarketView.exchangeParams.baseKey)
      quoteDecimals = 18
      baseDecimals = 18
    } else {
      const newportMarketView = marketView as OptionMarketViewer.MarketViewWithBoardsStructOutput
      // TODO: Fix
      spotPrice = newportMarketView.minSpotPrice
      quoteSymbol = newportMarketView.quoteSymbol
      quoteDecimals = newportMarketView.quoteDecimals.toNumber()
      baseSymbol = newportMarketView.baseSymbol
      baseDecimals = newportMarketView.baseDecimals.toNumber()
    }
    const quoteAddress = marketView.marketAddresses.quoteAsset
    const baseAddress = marketView.marketAddresses.baseAsset
    const name = getMarketName(baseSymbol, quoteSymbol)
    const tradingCutoff = marketView.marketParameters.tradeLimitParams.tradingCutoff.toNumber()
    const netDelta = marketView.globalNetGreeks.netDelta
    const netStdVega = marketView.globalNetGreeks.netStdVega
    const depositDelay = marketView.marketParameters.lpParams.depositDelay.toNumber()
    const withdrawalDelay = marketView.marketParameters.lpParams.withdrawalDelay.toNumber()
    return {
      address,
      name,
      isPaused,
      spotPrice,
      tradingCutoff,
      quoteToken: {
        address: quoteAddress,
        symbol: quoteSymbol,
        decimals: quoteDecimals,
      },
      baseToken: {
        address: baseAddress,
        symbol: baseSymbol,
        decimals: baseDecimals,
      },
      liquidityToken: {
        address: marketView.marketAddresses.liquidityToken,
        symbol: `${baseSymbol}LP`,
        decimals: 18,
      },
      contractAddresses: marketView.marketAddresses,
      netDelta,
      netStdVega,
      depositDelay,
      withdrawalDelay,
    }
  }

  // Getters

  static async get(lyra: Lyra, marketAddressOrName: string): Promise<Market> {
    const [marketView, block] = await Promise.all([
      fetchMarketView(lyra, marketAddressOrName),
      lyra.provider.getBlock('latest'),
    ])
    return new Market(lyra, marketView, block)
  }

  static async getMany(lyra: Lyra, marketAddresses: string[]): Promise<Market[]> {
    const [marketViews, block] = await Promise.all([
      Promise.all(marketAddresses.map(marketAddress => fetchMarketView(lyra, marketAddress))),
      lyra.provider.getBlock('latest'),
    ])
    return marketViews.map(marketView => {
      return new Market(lyra, marketView, block)
    })
  }

  static async getAll(lyra: Lyra): Promise<Market[]> {
    const marketAddresses = await fetchMarketAddresses(lyra)
    return await Market.getMany(
      lyra,
      marketAddresses.map(m => m.optionMarket)
    )
  }

  static find(markets: Market[], marketAddressOrName: string): Market | null {
    if (markets.length === 0) {
      return null
    }
    return findMarket(markets[0].lyra, markets, marketAddressOrName)
  }

  async refresh(): Promise<Market> {
    return await Market.get(this.lyra, this.address)
  }

  // Edges

  // TODO: @dappbeast Make async
  liveBoards(): Board[] {
    return this.__marketData.liveBoards
      .map(boardView => {
        return new Board(this.lyra, this, boardView, this.block)
      })
      .filter(b => this.block.timestamp < b.expiryTimestamp)
      .sort((a, b) => a.expiryTimestamp - b.expiryTimestamp)
  }

  liveBoard(boardId: number): Board {
    const boardView = this.liveBoardsMap[boardId]
    if (!boardView) {
      throw new Error('Board is expired or does not exist for market')
    }
    return new Board(this.lyra, this, boardView, this.block)
  }

  async board(boardId: number): Promise<Board> {
    try {
      // Attempt to return live board
      return this.liveBoard(boardId)
    } catch (_e) {
      const [boardView, block] = await Promise.all([
        getBoardView(this.lyra, this.address, boardId),
        this.lyra.provider.getBlock('latest'),
      ])
      return new Board(this.lyra, this, boardView, block)
    }
  }

  liveStrike(strikeId: number): Strike {
    const board = this.liveBoards().find(board => board.strikes().find(strike => strike.id === strikeId))
    const strike = board?.strikes().find(strike => strike.id === strikeId)
    if (!strike) {
      throw new Error('Strike is expired or does not exist for market')
    }
    return strike
  }

  async strike(strikeId: number): Promise<Strike> {
    try {
      return this.liveStrike(strikeId)
    } catch (_e) {
      const [boardView, block] = await Promise.all([
        getBoardViewForStrikeId(this.lyra, this.address, strikeId),
        this.lyra.provider.getBlock('latest'),
      ])
      const board = new Board(this.lyra, this, boardView, block)
      return board.strike(strikeId)
    }
  }

  liveOption(strikeId: number, isCall: boolean): Option {
    const strike = this.liveStrike(strikeId)
    return strike.option(isCall)
  }

  async option(strikeId: number, isCall: boolean): Promise<Option> {
    const strike = await this.strike(strikeId)
    return strike.option(isCall)
  }

  async quote(
    strikeId: number,
    isCall: boolean,
    isBuy: boolean,
    size: BigNumber,
    options?: QuoteOptions
  ): Promise<Quote> {
    const market = await this.refresh()
    return market.quoteSync(strikeId, isCall, isBuy, size, options)
  }

  quoteSync(strikeId: number, isCall: boolean, isBuy: boolean, size: BigNumber, options?: QuoteOptions): Quote {
    return this.liveOption(strikeId, isCall).quoteSync(isBuy, size, options)
  }

  async quoteAll(size: BigNumber, options?: QuoteOptions): Promise<MarketQuotes> {
    const market = await this.refresh()
    return market.quoteAllSync(size, options)
  }

  quoteAllSync(size: BigNumber, options?: QuoteOptions): MarketQuotes {
    return {
      boards: this.liveBoards().map(board => board.quoteAllSync(size, options)),
      market: this,
    }
  }

  async trade(
    owner: string,
    strikeId: number,
    isCall: boolean,
    isBuy: boolean,
    size: BigNumber,
    slippage: number,
    options?: MarketTradeOptions
  ): Promise<Trade> {
    return await Trade.get(this.lyra, owner, this.address, strikeId, isCall, isBuy, size, {
      slippage,
      ...options,
    })
  }

  // Dynamic fields
  async liquidity(): Promise<MarketLiquiditySnapshot> {
    return await fetchLatestLiquidity(this.lyra, this)
  }

  async netGreeks(): Promise<MarketNetGreeksSnapshot> {
    return await fetchLatestNetGreeks(this.lyra, this)
  }

  async liquidityHistory(options?: SnapshotOptions): Promise<MarketLiquiditySnapshot[]> {
    return await fetchLiquidityHistory(this.lyra, this, options)
  }

  async netGreeksHistory(options?: SnapshotOptions): Promise<MarketNetGreeksSnapshot[]> {
    return await fetchNetGreeksHistory(this.lyra, this, options)
  }

  async tradingVolumeHistory(options?: SnapshotOptions): Promise<MarketTradingVolumeSnapshot[]> {
    return await fetchTradingVolumeHistory(this.lyra, this, options)
  }

  async spotPriceHistory(options?: SnapshotOptions): Promise<MarketSpotCandle[]> {
    return await fetchSpotPriceHistory(this.lyra, this, options)
  }

  async owner(): Promise<string> {
    return await getMarketOwner(this.lyra, this.contractAddresses)
  }

  // Transactions

  async deposit(beneficiary: string, amount: BigNumber): Promise<PopulatedTransaction> {
    return await LiquidityDeposit.deposit(this.lyra, this.address, beneficiary, amount)
  }

  async withdraw(beneficiary: string, amount: BigNumber): Promise<PopulatedTransaction> {
    return await LiquidityWithdrawal.withdraw(this.lyra, this.address, beneficiary, amount)
  }
}

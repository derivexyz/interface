import { BigNumber } from '@ethersproject/bignumber'
import { PopulatedTransaction } from '@ethersproject/contracts'

import Lyra, { Market, MarketContractAddresses, Version } from '..'
import { LyraContractId, LyraGlobalContractId, LyraMarketContractId } from '../constants/contracts'
import { LyraContractMap, LyraMarketContractMap } from '../constants/mappings'
import { PoolHedger } from '../contracts/avalon/typechain/ShortPoolHedger'
import { LyraRegistry } from '../contracts/newport/typechain'
import { OptionGreekCache, OptionMarketPricer, OptionMarketViewer, OptionToken } from '../contracts/newport/typechain'
import buildTx from '../utils/buildTx'
import fetchMarketView from '../utils/fetchMarketView'
import getGlobalContract from '../utils/getGlobalContract'
import getGlobalOwner from '../utils/getGlobalOwner'
import getLyraContract from '../utils/getLyraContract'
import getLyraMarketContract from '../utils/getLyraMarketContract'
import getLyraMarketContractForAddress from '../utils/getLyraMarketContractForAddress'

export type MarketGlobalCache = {
  minUpdatedAt: BigNumber
  minUpdatedAtPrice: BigNumber
  maxUpdatedAtPrice: BigNumber
  maxSkewVariance: BigNumber
  maxIvVariance: BigNumber
  netGreeks: OptionGreekCache.NetGreeksStruct
  isGlobalCacheStale: boolean
}

export type GreekCacheParams = {
  [prop in keyof OptionGreekCache.GreekCacheParametersStruct]: BigNumber
}

export type SetMarketParamsReturn<T> = {
  params: T
  tx: PopulatedTransaction
}

export type ForceCloseParams = {
  [prop in keyof OptionGreekCache.ForceCloseParametersStruct]: BigNumber
}

export type MinCollateralParams = {
  [prop in keyof OptionGreekCache.MinCollateralParametersStruct]: BigNumber
}

export type OptionMarketParams = {
  maxBoardExpiry: BigNumber
  securityModule: string
  feePortionReserved: BigNumber
  staticBaseSettlementFee: BigNumber
}

export type LpParams = {
  minDepositWithdraw: BigNumber
  depositDelay: BigNumber
  withdrawalDelay: BigNumber
  withdrawalFee: BigNumber
  guardianMultisig: string
  guardianDelay: BigNumber
  adjustmentNetScalingFactor: BigNumber
  callCollatScalingFactor: BigNumber
  putCollatScalingFactor: BigNumber
}

export type AvalonLpParams = LpParams & {
  liquidityCBThreshold: BigNumber
  liquidityCBTimeout: BigNumber
  ivVarianceCBThreshold: BigNumber
  skewVarianceCBThreshold: BigNumber
  ivVarianceCBTimeout: BigNumber
  skewVarianceCBTimeout: BigNumber
  boardSettlementCBTimeout: BigNumber
  maxFeePaid: BigNumber
}

export type PricingParams = {
  [prop in keyof OptionMarketPricer.PricingParametersStruct]: BigNumber
}

export type TradeLimitParams = {
  minDelta: BigNumber
  minForceCloseDelta: BigNumber
  tradingCutoff: BigNumber
  minBaseIV: BigNumber
  maxBaseIV: BigNumber
  minSkew: BigNumber
  maxSkew: BigNumber
  minVol: BigNumber
  maxVol: BigNumber
  absMinSkew: BigNumber
  absMaxSkew: BigNumber
  capSkewsToAbs: boolean
}

export type VarianceFeeParams = {
  [prop in keyof OptionMarketPricer.VarianceFeeParametersStruct]: BigNumber
}

export type PartialCollatParams = {
  [prop in keyof OptionToken.PartialCollateralParametersStruct]: BigNumber
}

export type PoolHedgerParams = {
  [prop in keyof PoolHedger.PoolHedgerParametersStruct]: BigNumber
}

export type BoardParams = {
  expiry: BigNumber
  baseIV: BigNumber
  strikePrices: BigNumber[]
  skews: BigNumber[]
  frozen: boolean
}

export type AddBoardReturn = {
  tx: PopulatedTransaction
  board: BoardParams
}

export type StrikeParams = {
  boardId: BigNumber
  strikePrice: BigNumber
  skew: BigNumber
}

export type AddStrikeReturn = {
  tx: PopulatedTransaction
  strike: StrikeParams
}

export class Admin {
  private lyra: Lyra

  constructor(lyra: Lyra) {
    this.lyra = lyra
  }

  static get(lyra: Lyra): Admin {
    return new Admin(lyra)
  }

  getLyraContract<V extends Version, C extends LyraContractId>(version: V, contractId: C): LyraContractMap<V, C> {
    return getLyraContract(this.lyra, version, contractId) as LyraContractMap<V, C>
  }

  getGlobalContract(contractId: LyraGlobalContractId) {
    return getGlobalContract(this.lyra, contractId)
  }

  getMarketContract<V extends Version, C extends LyraMarketContractId>(
    marketContractAddresses: MarketContractAddresses,
    version: V,
    contractId: C
  ): LyraMarketContractMap<V, C> {
    return getLyraMarketContract(this.lyra, marketContractAddresses, version, contractId)
  }

  getMarketContractForAddress<V extends Version>(
    marketContractAddresses: MarketContractAddresses,
    version: V,
    contractAddress: string
  ) {
    return getLyraMarketContractForAddress(this.lyra, version, marketContractAddresses, contractAddress)
  }

  async globalOwner(): Promise<string> {
    return await getGlobalOwner(this.lyra)
  }

  async isMarketPaused(marketAddress: string): Promise<boolean> {
    const exchangeAdapter = this.getLyraContract(this.lyra.version, LyraContractId.ExchangeAdapter)
    return await exchangeAdapter.isMarketPaused(marketAddress)
  }

  async isGlobalPaused(): Promise<boolean> {
    const exchangeAdapter = this.getLyraContract(this.lyra.version, LyraContractId.ExchangeAdapter)
    return await exchangeAdapter.isGlobalPaused()
  }

  async getMarketGlobalCache(marketAddress: string): Promise<MarketGlobalCache> {
    const market = await this.lyra.market(marketAddress)
    const optionGreekCache = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.OptionGreekCache
    )
    const [isGlobalCacheStale, globalCache] = await Promise.all([
      optionGreekCache.isGlobalCacheStale(market.spotPrice),
      optionGreekCache.getGlobalCache(),
    ])
    return { ...globalCache, isGlobalCacheStale }
  }

  setGlobalPaused(account: string, isPaused: boolean): PopulatedTransaction {
    const exchangeAdapter = this.getLyraContract(this.lyra.version, LyraContractId.ExchangeAdapter)
    const calldata = exchangeAdapter.interface.encodeFunctionData('setGlobalPaused', [isPaused])
    const tx = buildTx(
      this.lyra.provider,
      this.lyra.provider.network.chainId,
      exchangeAdapter.address,
      account,
      calldata
    )
    return {
      ...tx,
      gasLimit: BigNumber.from(10_000_000),
    }
  }

  setMarketPaused(account: string, marketAddress: string, isPaused: boolean): PopulatedTransaction {
    const exchangeAdapter = this.getLyraContract(this.lyra.version, LyraContractId.ExchangeAdapter)
    const calldata = exchangeAdapter.interface.encodeFunctionData('setMarketPaused', [marketAddress, isPaused])
    const tx = buildTx(
      this.lyra.provider,
      this.lyra.provider.network.chainId,
      exchangeAdapter.address,
      account,
      calldata
    )
    return {
      ...tx,
      gasLimit: BigNumber.from(10_000_000),
    }
  }

  addMarketToViewer(
    account: string,
    newMarketAddresses: OptionMarketViewer.OptionMarketAddressesStruct
  ): PopulatedTransaction {
    const viewer = this.getLyraContract(this.lyra.version, LyraContractId.OptionMarketViewer)
    const calldata = viewer.interface.encodeFunctionData('addMarket', [newMarketAddresses])
    const tx = buildTx(this.lyra.provider, this.lyra.provider.network.chainId, viewer.address, account, calldata)
    return {
      ...tx,
      gasLimit: BigNumber.from(10_000_000),
    }
  }

  addMarketToRegistry(
    account: string,
    newMarketAddresses: LyraRegistry.OptionMarketAddressesStruct
  ): PopulatedTransaction {
    const registry = this.getLyraContract(this.lyra.version, LyraContractId.LyraRegistry)
    const calldata = registry.interface.encodeFunctionData('addMarket', [newMarketAddresses])
    const tx = buildTx(this.lyra.provider, this.lyra.provider.network.chainId, registry.address, account, calldata)
    return {
      ...tx,
      gasLimit: BigNumber.from(10_000_000),
    }
  }

  // Market admin functions
  async addBoard(
    marketAddressOrName: string,
    account: string,
    expiry: BigNumber,
    baseIV: BigNumber,
    strikePrices: BigNumber[],
    skews: BigNumber[],
    frozen: boolean = false
  ): Promise<AddBoardReturn> {
    const market = await this.lyra.market(marketAddressOrName)
    const optionMarket = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.OptionMarket
    )
    const calldata = optionMarket.interface.encodeFunctionData('createOptionBoard', [
      expiry,
      baseIV,
      strikePrices,
      skews,
      frozen,
    ])
    const tx = buildTx(this.lyra.provider, this.lyra.provider.network.chainId, optionMarket.address, account, calldata)
    tx.gasLimit = BigNumber.from(10_000_000)
    return { tx, board: { expiry, baseIV, strikePrices, skews, frozen } }
  }

  async addStrikeToBoard(
    marketAddresOrName: string,
    account: string,
    boardId: BigNumber,
    strike: BigNumber,
    skew: BigNumber
  ): Promise<AddStrikeReturn> {
    const market = await this.lyra.market(marketAddresOrName)
    const optionMarket = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.OptionMarket
    )
    const calldata = optionMarket.interface.encodeFunctionData('addStrikeToBoard', [boardId, strike, skew])
    const tx = buildTx(this.lyra.provider, this.lyra.provider.network.chainId, optionMarket.address, account, calldata)
    tx.gasLimit = BigNumber.from(10_000_000)
    return {
      tx,
      strike: {
        boardId,
        strikePrice: strike,
        skew,
      },
    }
  }

  setBoardPaused(market: Market, account: string, boardId: BigNumber, isPaused: boolean): PopulatedTransaction {
    const optionMarket = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.OptionMarket
    )
    const calldata = optionMarket.interface.encodeFunctionData('setBoardFrozen', [boardId, isPaused])
    const tx = buildTx(this.lyra.provider, this.lyra.provider.network.chainId, optionMarket.address, account, calldata)
    return {
      ...tx,
      gasLimit: BigNumber.from(10_000_000),
    }
  }

  setBoardBaseIv(market: Market, account: string, boardId: BigNumber, baseIv: BigNumber): PopulatedTransaction {
    const optionMarket = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.OptionMarket
    )
    const calldata = optionMarket.interface.encodeFunctionData('setBoardBaseIv', [boardId, baseIv])
    const tx = buildTx(this.lyra.provider, this.lyra.provider.network.chainId, optionMarket.address, account, calldata)
    return {
      ...tx,
      gasLimit: BigNumber.from(10_000_000),
    }
  }

  async setGreekCacheParams(
    market: Market,
    account: string,
    greekCacheParams: Partial<GreekCacheParams>
  ): Promise<SetMarketParamsReturn<GreekCacheParams>> {
    const currMarketView = await fetchMarketView(this.lyra, market.address)
    const toGreekCacheParams = {
      ...currMarketView.marketParameters.greekCacheParams,
      ...greekCacheParams,
    }
    const optionGreekCache = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      // TODO: @dappbeast Don't hardcode this version
      Version.Newport,
      LyraMarketContractId.OptionGreekCache
    )
    const calldata = optionGreekCache.interface.encodeFunctionData('setGreekCacheParameters', [toGreekCacheParams])
    const tx = buildTx(
      this.lyra.provider,
      this.lyra.provider.network.chainId,
      optionGreekCache.address,
      account,
      calldata
    )
    tx.gasLimit = BigNumber.from(10_000_000)
    return { params: toGreekCacheParams, tx }
  }

  async setForceCloseParams(
    market: Market,
    account: string,
    forceCloseParams: Partial<ForceCloseParams>
  ): Promise<SetMarketParamsReturn<ForceCloseParams>> {
    const currMarketView = await fetchMarketView(this.lyra, market.address)
    const toForceCloseParams = {
      ...currMarketView.marketParameters.forceCloseParams,
      ...forceCloseParams,
    }
    const optionGreekCache = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.OptionGreekCache
    )
    const calldata = optionGreekCache.interface.encodeFunctionData('setForceCloseParameters', [toForceCloseParams])
    const tx = buildTx(
      this.lyra.provider,
      this.lyra.provider.network.chainId,
      optionGreekCache.address,
      account,
      calldata
    )
    tx.gasLimit = BigNumber.from(10_000_000)
    return { params: toForceCloseParams, tx }
  }

  async setMinCollateralParams(
    market: Market,
    account: string,
    minCollateralParams: Partial<MinCollateralParams>
  ): Promise<SetMarketParamsReturn<MinCollateralParams>> {
    const currMarketView = await fetchMarketView(this.lyra, market.address)
    const toMinCollateralParams = {
      ...currMarketView.marketParameters.minCollatParams,
      ...minCollateralParams,
    }
    const optionGreekCache = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.OptionGreekCache
    )
    const calldata = optionGreekCache.interface.encodeFunctionData('setMinCollateralParameters', [
      toMinCollateralParams,
    ])
    const tx = buildTx(
      this.lyra.provider,
      this.lyra.provider.network.chainId,
      optionGreekCache.address,
      account,
      calldata
    )
    tx.gasLimit = BigNumber.from(10_000_000)
    return { params: toMinCollateralParams, tx }
  }

  async setLpParams(
    market: Market,
    account: string,
    lpParams: Partial<LpParams>
  ): Promise<SetMarketParamsReturn<LpParams>> {
    if (this.lyra.version !== Version.Newport) {
      throw Error('Incorrect SDK version')
    }
    const currMarketView = await fetchMarketView(this.lyra, market.address)
    const toLPParams = {
      ...currMarketView.marketParameters.lpParams,
      ...lpParams,
    } as LpParams

    const liquidityPool = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.LiquidityPool
    )
    const calldata = liquidityPool.interface.encodeFunctionData('setLiquidityPoolParameters', [toLPParams])
    const tx = buildTx(this.lyra.provider, this.lyra.provider.network.chainId, liquidityPool.address, account, calldata)
    tx.gasLimit = BigNumber.from(10_000_000)
    return { params: toLPParams, tx }
  }

  async setAvalonLpParams(market: Market, account: string, lpParams: Partial<AvalonLpParams>) {
    if (this.lyra.version !== Version.Avalon) {
      throw Error('Incorrect SDK version')
    }
    const currMarketView = await fetchMarketView(this.lyra, market.address)
    const toLPParams = {
      ...currMarketView.marketParameters.lpParams,
      ...lpParams,
    } as AvalonLpParams

    const liquidityPool = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.LiquidityPool
    )
    const calldata = liquidityPool.interface.encodeFunctionData('setLiquidityPoolParameters', [toLPParams])
    const tx = buildTx(this.lyra.provider, this.lyra.provider.network.chainId, liquidityPool.address, account, calldata)
    tx.gasLimit = BigNumber.from(10_000_000)
    return { params: toLPParams, tx }
  }

  async setPricingParams(
    market: Market,
    account: string,
    pricingParams: Partial<PricingParams>
  ): Promise<SetMarketParamsReturn<PricingParams>> {
    const currMarketView = await fetchMarketView(this.lyra, market.address)
    const toPricingParams = {
      ...currMarketView.marketParameters.pricingParams,
      ...pricingParams,
    }
    const optionMarketPricer = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.OptionMarketPricer
    )
    const calldata = optionMarketPricer.interface.encodeFunctionData('setPricingParams', [toPricingParams])
    const tx = buildTx(
      this.lyra.provider,
      this.lyra.provider.network.chainId,
      optionMarketPricer.address,
      account,
      calldata
    )
    tx.gasLimit = BigNumber.from(10_000_000)
    return { params: toPricingParams, tx }
  }

  async setTradeLimitParams(
    market: Market,
    account: string,
    tradeLimitParams: Partial<TradeLimitParams>
  ): Promise<SetMarketParamsReturn<TradeLimitParams>> {
    const currMarketView = await fetchMarketView(this.lyra, market.address)
    const toTradeLimitParams = {
      ...currMarketView.marketParameters.tradeLimitParams,
      ...tradeLimitParams,
    }
    const optionMarketPricer = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.OptionMarketPricer
    )
    const calldata = optionMarketPricer.interface.encodeFunctionData('setTradeLimitParams', [toTradeLimitParams])
    const tx = buildTx(
      this.lyra.provider,
      this.lyra.provider.network.chainId,
      optionMarketPricer.address,
      account,
      calldata
    )
    tx.gasLimit = BigNumber.from(10_000_000)
    return { params: toTradeLimitParams, tx }
  }

  async setVarianceFeeParams(
    market: Market,
    account: string,
    params: Partial<VarianceFeeParams>
  ): Promise<SetMarketParamsReturn<VarianceFeeParams>> {
    const currMarketView = await fetchMarketView(this.lyra, market.address)
    const toParams = {
      ...currMarketView.marketParameters.varianceFeeParams,
      ...params,
    }
    const optionMarketPricer = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.OptionMarketPricer
    )
    const calldata = optionMarketPricer.interface.encodeFunctionData('setVarianceFeeParams', [toParams])
    const tx = buildTx(
      this.lyra.provider,
      this.lyra.provider.network.chainId,
      optionMarketPricer.address,
      account,
      calldata
    )
    tx.gasLimit = BigNumber.from(10_000_000)
    return { params: toParams, tx }
  }

  async setPartialCollatParams(
    market: Market,
    account: string,
    params: Partial<PartialCollatParams>
  ): Promise<SetMarketParamsReturn<PartialCollatParams>> {
    const currMarketView = await fetchMarketView(this.lyra, market.address)
    const toParams = {
      ...currMarketView.marketParameters.partialCollatParams,
      ...params,
    }
    const optionToken = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.OptionToken
    )
    const calldata = optionToken.interface.encodeFunctionData('setPartialCollateralParams', [toParams])
    const tx = buildTx(this.lyra.provider, this.lyra.provider.network.chainId, optionToken.address, account, calldata)
    tx.gasLimit = BigNumber.from(10_000_000)
    return { params: toParams, tx }
  }

  async setOptionMarketParams(
    market: Market,
    account: string,
    params: Partial<OptionMarketParams>
  ): Promise<SetMarketParamsReturn<OptionMarketParams>> {
    const currMarketView = await fetchMarketView(this.lyra, market.address)
    const toParams = {
      ...currMarketView.marketParameters.optionMarketParams,
      ...params,
    }
    const optionMarket = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.OptionMarket
    )
    const calldata = optionMarket.interface.encodeFunctionData('setOptionMarketParams', [toParams])
    const tx = buildTx(this.lyra.provider, this.lyra.provider.network.chainId, optionMarket.address, account, calldata)
    tx.gasLimit = BigNumber.from(10_000_000)
    return { params: toParams, tx }
  }

  // TODO @michaelxuwu pool hedger param fns

  processDepositQueue(market: Market, account: string, limit: number): PopulatedTransaction {
    const liquidityPool = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.LiquidityPool
    )
    const calldata = liquidityPool.interface.encodeFunctionData('processDepositQueue', [limit])
    const tx = buildTx(this.lyra.provider, this.lyra.provider.network.chainId, liquidityPool.address, account, calldata)
    tx.gasLimit = BigNumber.from(10_000_000)
    return tx
  }

  processWithdrawalQueue(market: Market, account: string, limit: number): PopulatedTransaction {
    const liquidityPool = getLyraMarketContract(
      this.lyra,
      market.contractAddresses,
      this.lyra.version,
      LyraMarketContractId.LiquidityPool
    )
    const calldata = liquidityPool.interface.encodeFunctionData('processWithdrawalQueue', [limit])
    const tx = buildTx(this.lyra.provider, this.lyra.provider.network.chainId, liquidityPool.address, account, calldata)
    tx.gasLimit = BigNumber.from(10_000_000)
    return tx
  }
}

import {
  LiquidityPool as AvalonLiquidityPool,
  LiquidityToken as AvalonLiquidityToken,
  LyraRegistry as AvalonLyraRegistry,
  OptionGreekCache as AvalonOptionGreekCache,
  OptionMarket as AvalonOptionMarket,
  OptionMarketPricer as AvalonOptionMarketPricer,
  OptionMarketViewer as AvalonOptionMarketViewer,
  OptionToken as AvalonOptionToken,
  ShortCollateral as AvalonShortCollateral,
  ShortPoolHedger as AvalonShortPoolHedger,
  SynthetixAdapter as AvalonSynthetixAdapter,
  TestFaucet as AvalonTestFaucet,
} from '../contracts/avalon/typechain'
import {
  ArrakisPool,
  LyraStakingModule,
  Multicall3,
  MultiDistributor,
  StakingRewards,
  TokenMigrator,
} from '../contracts/common/typechain'
import {
  ExchangeAdapter as NewportExchangeAdapter,
  LiquidityPool as NewportLiquidityPool,
  LiquidityToken as NewportLiquidityToken,
  LyraRegistry as NewportLyraRegistry,
  OptionGreekCache as NewportOptionGreekCache,
  OptionMarket as NewportOptionMarket,
  OptionMarketPricer as NewportOptionMarketPricer,
  OptionMarketViewer as NewportOptionMarketViewer,
  OptionToken as NewportOptionToken,
  PoolHedger as NewportPoolHedger,
  ShortCollateral as NewportShortCollateral,
  TestFaucet as NewportTestFaucet,
} from '../contracts/newport/typechain'
import { Version } from '../lyra'
import { LyraContractId, LyraGlobalContractId, LyraMarketContractId } from './contracts'

export type LyraNewportContractMap = {
  [LyraContractId.OptionMarketViewer]: NewportOptionMarketViewer
  [LyraContractId.TestFaucet]: NewportTestFaucet
  [LyraContractId.ExchangeAdapter]: NewportExchangeAdapter
  [LyraContractId.LyraRegistry]: NewportLyraRegistry
}

export type LyraAvalonContractMap = {
  [LyraContractId.OptionMarketViewer]: AvalonOptionMarketViewer
  [LyraContractId.TestFaucet]: AvalonTestFaucet
  [LyraContractId.ExchangeAdapter]: AvalonSynthetixAdapter
  [LyraContractId.LyraRegistry]: AvalonLyraRegistry
}

export type LyraContractMap<V extends Version, C extends LyraContractId> = V extends Version.Avalon
  ? LyraAvalonContractMap[C]
  : V extends Version.Newport
  ? LyraNewportContractMap[C]
  : never

export type LyraMarketAvalonContractMap = {
  [LyraMarketContractId.OptionMarket]: AvalonOptionMarket
  [LyraMarketContractId.OptionMarketPricer]: AvalonOptionMarketPricer
  [LyraMarketContractId.OptionToken]: AvalonOptionToken
  [LyraMarketContractId.ShortCollateral]: AvalonShortCollateral
  [LyraMarketContractId.OptionGreekCache]: AvalonOptionGreekCache
  [LyraMarketContractId.LiquidityToken]: AvalonLiquidityToken
  [LyraMarketContractId.LiquidityPool]: AvalonLiquidityPool
  [LyraMarketContractId.PoolHedger]: AvalonShortPoolHedger
}

export type LyraMarketNewportContractMap = {
  [LyraMarketContractId.OptionMarket]: NewportOptionMarket
  [LyraMarketContractId.OptionMarketPricer]: NewportOptionMarketPricer
  [LyraMarketContractId.OptionToken]: NewportOptionToken
  [LyraMarketContractId.ShortCollateral]: NewportShortCollateral
  [LyraMarketContractId.OptionGreekCache]: NewportOptionGreekCache
  [LyraMarketContractId.LiquidityToken]: NewportLiquidityToken
  [LyraMarketContractId.LiquidityPool]: NewportLiquidityPool
  [LyraMarketContractId.PoolHedger]: NewportPoolHedger
}

export type LyraMarketContractMap<V extends Version, C extends LyraMarketContractId> = V extends Version.Avalon
  ? LyraMarketAvalonContractMap[C]
  : V extends Version.Newport
  ? LyraMarketNewportContractMap[C]
  : never

export type LyraGlobalContractMap = {
  [LyraGlobalContractId.MultiDistributor]: MultiDistributor
  [LyraGlobalContractId.ArrakisPool]: ArrakisPool
  [LyraGlobalContractId.WethLyraStakingRewards]: StakingRewards
  [LyraGlobalContractId.Multicall3]: Multicall3
  [LyraGlobalContractId.LyraStakingModule]: LyraStakingModule
  [LyraGlobalContractId.TokenMigrator]: TokenMigrator
}

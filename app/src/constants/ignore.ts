import { Chain } from '@lyrafinance/lyra-js'

import filterNulls from '../utils/filterNulls'

export type IgnoreStrike = {
  marketName: string
  strikeId: number
  chain: Chain
}

export type IgnoreVault = {
  marketName: string
  chain: Chain
}

export type IgnoreMarket = {
  marketName: string
  chain: Chain
}

export const IGNORE_STRIKE_LIST: IgnoreStrike[] = []

export const IGNORE_VAULTS_LIST: IgnoreVault[] = filterNulls([
  {
    marketName: 'sSOL-sUSD',
    chain: Chain.Optimism,
  },
])

export const IGNORE_MARKETS_LIST: IgnoreMarket[] = filterNulls([
  {
    marketName: 'sSOL-sUSD',
    chain: Chain.Optimism,
  },
  {
    marketName: 'WBTC-USDC',
    chain: Chain.Arbitrum,
  },
])

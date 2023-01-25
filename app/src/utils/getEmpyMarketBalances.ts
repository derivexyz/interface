import { AccountBalances, Market } from '@lyrafinance/lyra-js'

import { ZERO_BN } from '../constants/bn'

const getEmptyMarketBalances = (owner: string, market: Market): AccountBalances => ({
  owner,
  market,
  marketAddress: market.address,
  marketName: market.name,
  quoteAsset: {
    ...market.quoteToken,
    balance: ZERO_BN,
    tradeAllowance: ZERO_BN,
    depositAllowance: ZERO_BN,
  },
  baseAsset: {
    ...market.baseToken,
    balance: ZERO_BN,
    tradeAllowance: ZERO_BN,
  },
  liquidityToken: {
    ...market.liquidityToken,
    balance: ZERO_BN,
  },
})

export default getEmptyMarketBalances

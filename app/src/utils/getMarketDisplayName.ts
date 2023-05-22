import { Market } from '@lyrafinance/lyra-js'

export default function getMarketDisplayName(market: Market): string {
  switch (market.baseToken.symbol.toLowerCase()) {
    case 'eth':
    case 'seth':
    case 'weth':
      return 'Ethereum'
    case 'btc':
    case 'sbtc':
    case 'wbtc':
      return 'Bitcoin'
    case 'sol':
    case 'ssol':
      return 'Solana'
    case 'op':
      return 'Optimism'
    case 'arb':
    case 'lyarb':
      return 'Arbitrum'
    default:
      return ''
  }
}

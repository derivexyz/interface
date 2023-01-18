import { Market } from '@lyrafinance/lyra-js'

export default function getPriceColumnWidth(market: Market) {
  switch (market.baseToken.symbol.toLowerCase()) {
    case 'sbtc':
    case 'wbtc':
      return 112
    case 'eth':
    case 'seth':
    case 'weth':
    default:
      return 96
  }
}

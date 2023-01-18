import { Market } from '@lyrafinance/lyra-js'

import getAssetSrc from '@/app/utils/getAssetSrc'

export default function getMarketLogoURI(market: Market): string {
  switch (market.baseToken.symbol.toLowerCase()) {
    case 'seth':
    case 'eth':
    case 'weth':
      return getAssetSrc('/images/ethereum-logo.png')
    case 'btc':
    case 'sbtc':
    case 'wbtc':
      return getAssetSrc('/images/bitcoin-logo.png')
    case 'sol':
    case 'ssol':
      return getAssetSrc('/images/solana-logo.png')
    default:
      return ''
  }
}

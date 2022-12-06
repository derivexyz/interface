import getAssetSrc from '@/app/utils/getAssetSrc'

export default function getMarketLogoURI(marketName: string): string {
  switch (marketName.toLowerCase()) {
    case 'lylp':
    case 'seth':
    case 'eth':
    case 'seth-susd':
      return getAssetSrc('/images/ethereum-logo.png')
    case 'btc':
    case 'sbtc':
    case 'sbtc-susd':
    case 'wbtc-usdc':
      return getAssetSrc('/images/bitcoin-logo.png')
    case 'sol':
    case 'ssol':
    case 'ssol-susd':
      return getAssetSrc('/images/solana-logo.png')
    default:
      return ''
  }
}

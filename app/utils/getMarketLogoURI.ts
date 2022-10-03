import getAssetSrc from '@/app/utils/getAssetSrc'

export default function getMarketLogoURI(marketName: string): string {
  switch (marketName.toLowerCase()) {
    case 'lylp':
    case 'seth':
    case 'eth':
      return getAssetSrc('/images/ethereum-logo.png')
    case 'btc':
      return getAssetSrc('/images/bitcoin-logo.png')
    case 'link':
      return getAssetSrc('/images/chainlink-logo.png')
    case 'sol':
      return getAssetSrc('/images/solana-logo.png')
    case 'aave':
      return 'https://ethereum-optimism.github.io/logos/AAVE.svg'
    case 'avax':
      return getAssetSrc('/images/avax-logo.png')
    case 'matic':
      return getAssetSrc('/images/matic-logo.png')
    case 'uni':
      return 'https://ethereum-optimism.github.io/logos/UNI.png'
    case 'wti':
      return getAssetSrc('/images/wti-logo.png')
    default:
      return ''
  }
}

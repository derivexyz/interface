import { Network } from '@lyrafinance/lyra-js'

import getAssetSrc from '@/app/utils/getAssetSrc'

export default function getNetworkLogoURI(network: Network | 'ethereum'): string {
  switch (network) {
    case Network.Arbitrum:
      return getAssetSrc('/images/arbitrum.svg')
    case Network.Optimism:
      return getAssetSrc('/images/optimism.png')
    case 'ethereum':
      return getAssetSrc('/images/ethereum-logo.png')
  }
}

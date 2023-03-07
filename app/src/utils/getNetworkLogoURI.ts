import getAssetSrc from '@/app/utils/getAssetSrc'

import { AppNetwork, Network } from '../constants/networks'
import resolveNetwork from './resolveNetwork'

export default function getNetworkLogoURI(network: Network): string {
  switch (resolveNetwork(network)) {
    case AppNetwork.Arbitrum:
      return getAssetSrc('/images/arbitrum.svg')
    case AppNetwork.Optimism:
      return getAssetSrc('/images/optimism.png')
    case AppNetwork.Ethereum:
      return getAssetSrc('/images/ethereum-logo.png')
  }
}

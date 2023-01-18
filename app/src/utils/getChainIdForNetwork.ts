import { Network } from '@lyrafinance/lyra-js'

import getArbitrumChainId from './getArbitrumChainId'
import getOptimismChainId from './getOptimismChainId'

export const getChainIdForNetwork = (network: Network | 'ethereum') => {
  if (network === 'ethereum') {
    return 1
  } else {
    switch (network) {
      case Network.Arbitrum:
        return getArbitrumChainId()
      case Network.Optimism:
        return getOptimismChainId()
    }
  }
}

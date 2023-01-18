import { Network } from '@lyrafinance/lyra-js'

import { lyraArbitrum, lyraOptimism } from './lyra'

const getLyraSDK = (network: Network) => {
  switch (network) {
    case Network.Arbitrum:
      return lyraArbitrum
    case Network.Optimism:
      return lyraOptimism
  }
}

export default getLyraSDK

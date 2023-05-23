import { Network, Version } from '@lyrafinance/lyra-js'

import { lyraArbitrum, lyraAvalon, lyraOptimism } from './lyra'

const getLyraSDK = (network: Network, version: Version = Version.Newport) => {
  switch (network) {
    case Network.Arbitrum:
      return lyraArbitrum
    case Network.Optimism:
      switch (version) {
        case Version.Avalon:
          return lyraAvalon
        case Version.Newport:
        default:
          return lyraOptimism
      }
  }
}

export default getLyraSDK

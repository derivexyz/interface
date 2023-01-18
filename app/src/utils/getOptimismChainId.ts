import { Chain } from '@lyrafinance/lyra-js'

import getNetworkConfig from './getNetworkConfig'
import isMainnet from './isMainnet'

export default function getOptimismChainId(): number {
  return isMainnet() ? getNetworkConfig(Chain.Optimism).chainId : getNetworkConfig(Chain.OptimismGoerli).chainId
}

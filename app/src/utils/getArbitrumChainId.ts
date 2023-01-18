import { Chain } from '@lyrafinance/lyra-js'

import getNetworkConfig from './getNetworkConfig'
import isMainnet from './isMainnet'

export default function getArbitrumChainId(): number {
  return isMainnet() ? getNetworkConfig(Chain.Arbitrum).chainId : getNetworkConfig(Chain.ArbitrumGoerli).chainId
}

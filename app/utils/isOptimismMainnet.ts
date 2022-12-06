import { Chain } from '@lyrafinance/lyra-js'

import getChainForChainId from './getChainForChainId'
import getOptimismChainId from './getOptimismChainId'

// TODO @michaelxuwu replace with isMainnet?
export default function isOptimismMainnet(): boolean {
  return getChainForChainId(getOptimismChainId()) === Chain.Optimism
}

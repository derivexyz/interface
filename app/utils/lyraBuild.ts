import Lyra from '@lyrafinance/lyra-js'

import { NETWORK_CONFIGS } from '../constants/networks'
import CachedStaticJsonRpcProvider from './CachedStaticJsonRpcProvider'
import filterNulls from './filterNulls'
import getOptimismChainId from './getOptimismChainId'
import isOptimismMainnet from './isOptimismMainnet'

const optimismChainId = getOptimismChainId()

const buildInfuraId = process.env.BUILD_INFURA_PROJECT_ID
const buildAlchemyId = process.env.BUILD_ALCHEMY_PROJECT_ID
const networkConfig = NETWORK_CONFIGS[optimismChainId]
const rpcUrl =
  buildInfuraId && isOptimismMainnet()
    ? filterNulls([
        `https://optimism-mainnet.infura.io/v3/${buildInfuraId}`,
        buildAlchemyId ? `https://opt-mainnet.g.alchemy.com/v2/${buildAlchemyId}` : null,
      ])
    : networkConfig.readRpcUrls
const optimismProvider = new CachedStaticJsonRpcProvider(rpcUrl, networkConfig.chainId)
if (buildInfuraId) {
  console.log('Using build node providers')
}
const lyraBuild = new Lyra({
  provider: optimismProvider,
})
export default lyraBuild

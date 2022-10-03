import Lyra from '@lyrafinance/lyra-js'

import { NETWORK_CONFIGS } from '../constants/networks'
import CachedStaticJsonRpcProvider from './CachedStaticJsonRpcProvider'
import getOptimismChainId from './getOptimismChainId'
import isOptimismMainnet from './isOptimismMainnet'

const optimismChainId = getOptimismChainId()

const buildInfuraId = process.env.BUILD_INFURA_PROJECT_ID
const networkConfig = NETWORK_CONFIGS[optimismChainId]
const rpcUrl =
  buildInfuraId && isOptimismMainnet()
    ? `https://optimism-mainnet.infura.io/v3/${buildInfuraId}`
    : networkConfig.readRpcUrl
const optimismProvider = new CachedStaticJsonRpcProvider(rpcUrl, networkConfig.chainId)
if (buildInfuraId) {
  console.log('Detected infura build ID')
}
const lyraBuild = new Lyra({
  provider: optimismProvider,
})
export default lyraBuild

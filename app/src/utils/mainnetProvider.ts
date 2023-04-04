import { AppNetwork } from '../constants/networks'
import CachedStaticJsonRpcProvider from './CachedStaticJsonRpcProvider'
import getNetworkConfig from './getNetworkConfig'

const networkConfig = getNetworkConfig(AppNetwork.Ethereum)

const mainnetProvider = new CachedStaticJsonRpcProvider(networkConfig.rpcUrl, networkConfig.chainId)

export default mainnetProvider

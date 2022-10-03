import { EthereumChainId } from '../constants/networks'
import CachedStaticJsonRpcProvider from './CachedStaticJsonRpcProvider'
import getNetworkConfig from './getNetworkConfig'

const ethMainnet = getNetworkConfig(EthereumChainId.Mainnet)
const mainnetProvider = new CachedStaticJsonRpcProvider(ethMainnet.readRpcUrl, ethMainnet.chainId)

export default mainnetProvider

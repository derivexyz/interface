import nullthrows from 'nullthrows'

import CachedStaticJsonRpcProvider from './CachedStaticJsonRpcProvider'

const INFURA_PROJECT_ID = nullthrows(
  process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
  'Missing NEXT_PUBLIC_INFURA_PROJECT_ID in environment variables'
)

export const MAINNET_NETWORK_CONFIG = {
  name: 'Mainnet',
  shortName: 'Mainnet',
  chainId: 1,
  network: 'ethereum',
  walletRpcUrl: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  readRpcUrls: [`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`],
  blockExplorerUrl: 'https://etherscan.io/',
  iconUrls: [],
}

const mainnetProvider = new CachedStaticJsonRpcProvider(
  MAINNET_NETWORK_CONFIG.readRpcUrls,
  MAINNET_NETWORK_CONFIG.chainId
)

export default mainnetProvider

import nullthrows from 'nullthrows'

import CachedStaticJsonRpcProvider from './CachedStaticJsonRpcProvider'
import filterNulls from './filterNulls'

const REACT_APP_ALCHEMY_ETHEREUM_PROJECT_ID = process.env.REACT_APP_ALCHEMY_ETHEREUM_PROJECT_ID

const INFURA_PROJECT_ID = nullthrows(
  process.env.REACT_APP_INFURA_PROJECT_ID,
  'Missing REACT_APP_INFURA_PROJECT_ID in environment variables'
)

export const MAINNET_NETWORK_CONFIG = {
  name: 'Mainnet',
  shortName: 'Mainnet',
  chainId: 1,
  network: 'ethereum',
  walletRpcUrl: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  readRpcUrls: filterNulls([
    `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    REACT_APP_ALCHEMY_ETHEREUM_PROJECT_ID
      ? `https://eth-mainnet.g.alchemy.com/v2/${REACT_APP_ALCHEMY_ETHEREUM_PROJECT_ID}`
      : null,
  ]),
  blockExplorerUrl: 'https://etherscan.io/',
  iconUrls: [],
}

const mainnetProvider = new CachedStaticJsonRpcProvider(
  MAINNET_NETWORK_CONFIG.readRpcUrls,
  MAINNET_NETWORK_CONFIG.chainId
)

export default mainnetProvider

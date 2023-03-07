export { Network as LyraNetwork } from '@lyrafinance/lyra-js'
import { Network as LyraNetwork } from '@lyrafinance/lyra-js'
import nullthrows from 'nullthrows'

import filterNulls from '../utils/filterNulls'

export enum AppNetwork {
  Ethereum = 'ethereum',
  Arbitrum = 'arbitrum',
  Optimism = 'optimism',
}

export type Network = LyraNetwork | AppNetwork

export enum AppChain {
  Ethereum = 'ethereum',
  EthereumGoerli = 'ethereum-goerli',
  Optimism = 'optimism',
  OptimismGoerli = 'optimism-goerli',
  Arbitrum = 'arbitrum',
  ArbitrumGoerli = 'arbitrum-goerli',
}

export type NetworkConfig = {
  name: string
  displayName: string
  chainId: number
  network: AppNetwork
  walletRpcUrl: string
  readRpcUrls: string[]
  blockExplorerUrl: string
  iconUrls: string[]
  faucetUrl?: string
  nativeBridgeUrl?: string
  fastBridgeUrl?: string
}

const INFURA_PROJECT_ID = nullthrows(
  process.env.REACT_APP_INFURA_PROJECT_ID,
  'Missing REACT_APP_INFURA_PROJECT_ID in environment variables'
)
const ALCHEMY_OPTIMISM_PROJECT_ID = process.env.REACT_APP_ALCHEMY_OPTIMISM_PROJECT_ID
const ALCHEMY_ARBITRUM_PROJECT_ID = process.env.REACT_APP_ALCHEMY_ARBITRUM_PROJECT_ID
const ALCHEMY_ETHEREUM_PROJECT_ID = process.env.REACT_APP_ALCHEMY_ETHEREUM_PROJECT_ID

export const NETWORK_CONFIGS: Record<AppChain, NetworkConfig> = {
  [AppChain.Optimism]: {
    name: 'Optimistic Ethereum',
    displayName: 'Optimism',
    chainId: 10,
    network: AppNetwork.Optimism,
    walletRpcUrl: 'https://mainnet.optimism.io',
    readRpcUrls: filterNulls([
      `https://optimism-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      ALCHEMY_OPTIMISM_PROJECT_ID ? `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_OPTIMISM_PROJECT_ID}` : null,
    ]),
    blockExplorerUrl: 'https://optimistic.etherscan.io',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
    nativeBridgeUrl: 'https://app.optimism.io/bridge/withdraw',
    fastBridgeUrl: 'https://cbridge.celer.network/10/1/LYRA',
  },
  [AppChain.OptimismGoerli]: {
    name: 'Optimistic Ethereum (Goerli)',
    displayName: 'Optimistic Goerli',
    chainId: 420,
    network: AppNetwork.Optimism,
    walletRpcUrl: 'https://goerli.optimism.io',
    readRpcUrls: [`https://optimism-goerli.infura.io/v3/${INFURA_PROJECT_ID}`],
    blockExplorerUrl: 'https://goerli-optimism.etherscan.io/',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
    faucetUrl: 'https://faucet.paradigm.xyz/',
    nativeBridgeUrl: 'https://app.optimism.io/bridge/withdraw',
    fastBridgeUrl: 'https://cbridge.celer.network/10/1/LYRA',
  },
  [AppChain.Arbitrum]: {
    name: 'Arbitrum One',
    displayName: 'Arbitrum',
    chainId: 42161,
    network: AppNetwork.Arbitrum,
    walletRpcUrl: 'https://arb1.arbitrum.io/rpc',
    readRpcUrls: filterNulls([
      `https://arbitrum-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      ALCHEMY_ARBITRUM_PROJECT_ID ? `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_ARBITRUM_PROJECT_ID}` : null,
    ]),
    blockExplorerUrl: 'https://arbiscan.io/',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io/?l2ChainId=42161',
    fastBridgeUrl: 'https://cbridge.celer.network/42161/1/LYRA',
  },
  [AppChain.ArbitrumGoerli]: {
    name: 'Arbitrum Goerli',
    displayName: 'Arbitrum Goerli',
    chainId: 421613,
    network: AppNetwork.Arbitrum,
    walletRpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    readRpcUrls: [`https://arbitrum-goerli.infura.io/v3/${INFURA_PROJECT_ID}`],
    blockExplorerUrl: 'https://goerli.arbiscan.io/',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
    faucetUrl: 'https://faucet.quicknode.com/arbitrum/goerli',
    nativeBridgeUrl: 'https://bridge.arbitrum.io/?l2ChainId=42161',
    fastBridgeUrl: 'https://cbridge.celer.network/42161/1/LYRA',
  },
  [AppChain.Ethereum]: {
    name: 'Ethereum Mainnet',
    displayName: 'Ethereum',
    chainId: 1,
    network: AppNetwork.Ethereum,
    walletRpcUrl: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    readRpcUrls: filterNulls([
      `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      ALCHEMY_ETHEREUM_PROJECT_ID ? `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_ETHEREUM_PROJECT_ID}` : null,
    ]),
    blockExplorerUrl: 'https://etherscan.io/',
    iconUrls: [],
  },
  [AppChain.EthereumGoerli]: {
    name: 'Ethereum Goerli',
    displayName: 'Ethereum Goerli',
    chainId: 5,
    network: AppNetwork.Ethereum,
    walletRpcUrl: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
    readRpcUrls: [`https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`],
    blockExplorerUrl: 'https://goerli.etherscan.io/',
    iconUrls: [],
  },
}

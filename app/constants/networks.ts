import nullthrows from 'nullthrows'

import filterNulls from '../utils/filterNulls'

export enum EthereumChainId {
  Mainnet = 1,
  Kovan = 42,
  Local = 1337,
}

export enum OptimismChainId {
  OptimismMainnet = 10,
  OptimismKovan = 69,
  Local = 31337, // Optimism
}

export type ChainId = EthereumChainId | OptimismChainId

export enum Network {
  Optimism = 'Optimism',
  Ethereum = 'Ethereum',
}

export enum WalletType {
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
  CoinbaseWallet = 'CoinbaseWallet',
  GnosisSafe = 'GnosisSafe',
}

export type NetworkConfig = {
  name: string
  shortName: string
  chainId: ChainId
  network: Network
  walletRpcUrl: string
  readRpcUrls: string[]
  blockExplorerUrl: string
  iconUrls: string[]
}

const INFURA_PROJECT_ID = nullthrows(
  process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
  'Missing NEXT_PUBLIC_INFURA_PROJECT_ID in environment variables'
)
const ALCHEMY_PROJECT_ID = process.env.NEXT_PUBLIC_ALCHEMY_PROJECT_ID

export const NETWORK_CONFIGS: Record<ChainId, NetworkConfig> = {
  [EthereumChainId.Mainnet]: {
    name: 'Mainnet',
    shortName: 'Mainnet',
    chainId: EthereumChainId.Mainnet,
    network: Network.Ethereum,
    walletRpcUrl: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    readRpcUrls: [`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`],
    blockExplorerUrl: 'https://etherscan.io/',
    iconUrls: [],
  },
  [EthereumChainId.Kovan]: {
    name: 'Kovan',
    shortName: 'Kovan',
    chainId: EthereumChainId.Kovan,
    network: Network.Ethereum,
    walletRpcUrl: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
    readRpcUrls: [`https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`],
    blockExplorerUrl: 'https://kovan.etherscan.io',
    iconUrls: [],
  },
  [OptimismChainId.OptimismMainnet]: {
    name: 'Optimistic Ethereum',
    shortName: 'Optimism',
    chainId: OptimismChainId.OptimismMainnet,
    network: Network.Optimism,
    walletRpcUrl: 'https://mainnet.optimism.io',
    readRpcUrls: filterNulls([
      `https://optimism-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
      ALCHEMY_PROJECT_ID ? `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_PROJECT_ID}` : null,
    ]),
    blockExplorerUrl: 'https://optimistic.etherscan.io',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
  },
  [OptimismChainId.OptimismKovan]: {
    name: 'Optimistic Ethereum (Kovan)',
    shortName: 'Optimistic Kovan',
    chainId: OptimismChainId.OptimismKovan,
    network: Network.Optimism,
    walletRpcUrl: 'https://kovan.optimism.io',
    readRpcUrls: ['https://kovan.optimism.io'],
    blockExplorerUrl: 'https://kovan-explorer.optimism.io',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
  },
  [EthereumChainId.Local]: {
    name: 'Local',
    shortName: 'Local',
    chainId: EthereumChainId.Local,
    network: Network.Ethereum,
    walletRpcUrl: 'http://127.0.0.1:8545',
    readRpcUrls: ['http://127.0.0.1:8545'],
    blockExplorerUrl: 'https://kovan-explorer.optimism.io/',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
  },
  [OptimismChainId.Local]: {
    name: 'Local',
    shortName: 'Local',
    chainId: OptimismChainId.Local,
    network: Network.Optimism,
    walletRpcUrl: 'http://127.0.0.1:8545',
    readRpcUrls: ['http://127.0.0.1:8545'],
    blockExplorerUrl: 'https://kovan-explorer.optimism.io/',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
  },
}

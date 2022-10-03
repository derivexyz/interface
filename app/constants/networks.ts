import nullthrows from 'nullthrows'

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
}

export type NetworkConfig = {
  name: string
  shortName: string
  chainId: ChainId
  network: Network
  walletRpcUrl: string
  readRpcUrl: string
  blockExplorerUrl: string
  iconUrls: string[]
}

const INFURA_PROJECT_ID = nullthrows(
  process.env.NEXT_PUBLIC_INFURA_PROJECT_ID,
  'Missing NEXT_PUBLIC_INFURA_PROJECT_ID in environment variables'
)

export const NETWORK_CONFIGS: Record<ChainId, NetworkConfig> = {
  [EthereumChainId.Mainnet]: {
    name: 'Mainnet',
    shortName: 'Mainnet',
    chainId: EthereumChainId.Mainnet,
    network: Network.Ethereum,
    walletRpcUrl: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    readRpcUrl: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    blockExplorerUrl: 'https://etherscan.io/',
    iconUrls: [],
  },
  [EthereumChainId.Kovan]: {
    name: 'Kovan',
    shortName: 'Kovan',
    chainId: EthereumChainId.Kovan,
    network: Network.Ethereum,
    walletRpcUrl: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
    readRpcUrl: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
    blockExplorerUrl: 'https://kovan.etherscan.io',
    iconUrls: [],
  },
  [EthereumChainId.Local]: {
    name: 'Local',
    shortName: 'Local',
    chainId: EthereumChainId.Local,
    network: Network.Ethereum,
    walletRpcUrl: 'http://127.0.0.1:8545',
    readRpcUrl: 'http://127.0.0.1:8545',
    blockExplorerUrl: 'https://kovan-explorer.optimism.io/',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
  },
  [OptimismChainId.OptimismMainnet]: {
    name: 'Optimistic Ethereum',
    shortName: 'Optimism',
    chainId: OptimismChainId.OptimismMainnet,
    network: Network.Optimism,
    walletRpcUrl: 'https://mainnet.optimism.io',
    readRpcUrl: `https://optimism-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    blockExplorerUrl: 'https://optimistic.etherscan.io',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
  },
  [OptimismChainId.OptimismKovan]: {
    name: 'Optimistic Ethereum (Kovan)',
    shortName: 'Optimistic Kovan',
    chainId: OptimismChainId.OptimismKovan,
    network: Network.Optimism,
    walletRpcUrl: 'https://kovan.optimism.io',
    readRpcUrl: `https://optimism-kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
    blockExplorerUrl: 'https://kovan-explorer.optimism.io',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
  },
  [OptimismChainId.Local]: {
    name: 'Local',
    shortName: 'Local',
    chainId: OptimismChainId.Local,
    network: Network.Optimism,
    walletRpcUrl: 'http://127.0.0.1:8545',
    readRpcUrl: 'http://127.0.0.1:8545',
    blockExplorerUrl: 'https://kovan-explorer.optimism.io/',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
  },
}

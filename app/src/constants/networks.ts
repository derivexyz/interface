import { Chain, Network } from '@lyrafinance/lyra-js'
import nullthrows from 'nullthrows'

import filterNulls from '../utils/filterNulls'

export enum WalletType {
  MetaMask = 'MetaMask',
  WalletConnect = 'WalletConnect',
  CoinbaseWallet = 'CoinbaseWallet',
  GnosisSafe = 'GnosisSafe',
}

export type NetworkConfig = {
  name: string
  shortName: string
  chainId: number
  network: Network
  walletRpcUrl: string
  readRpcUrls: string[]
  blockExplorerUrl: string
  iconUrls: string[]
}

const INFURA_PROJECT_ID = nullthrows(
  process.env.REACT_APP_INFURA_PROJECT_ID,
  'Missing REACT_APP_INFURA_PROJECT_ID in environment variables'
)
const ALCHEMY_PROJECT_ID = process.env.REACT_APP_ALCHEMY_PROJECT_ID

export const NETWORK_CONFIGS: Record<Chain, NetworkConfig> = {
  [Chain.Optimism]: {
    name: 'Optimistic Ethereum',
    shortName: 'Optimism',
    chainId: 10,
    network: Network.Optimism,
    walletRpcUrl: 'https://mainnet.optimism.io',
    readRpcUrls: filterNulls([
      ALCHEMY_PROJECT_ID ? `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_PROJECT_ID}` : null,
      `https://optimism-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
    ]),
    blockExplorerUrl: 'https://optimistic.etherscan.io',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
  },
  [Chain.OptimismGoerli]: {
    name: 'Optimistic Ethereum (Goerli)',
    shortName: 'Optimistic Goerli',
    chainId: 420,
    network: Network.Optimism,
    walletRpcUrl: 'https://goerli.optimism.io',
    readRpcUrls: [`https://optimism-goerli.infura.io/v3/${INFURA_PROJECT_ID}`],
    blockExplorerUrl: 'https://goerli-optimism.etherscan.io/',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
  },
  [Chain.Arbitrum]: {
    name: 'Arbitrum One',
    shortName: 'Arbitrum',
    chainId: 42161,
    network: Network.Arbitrum,
    walletRpcUrl: 'https://arb1.arbitrum.io/rpc',
    readRpcUrls: [`https://arbitrum-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`],
    blockExplorerUrl: 'https://arbiscan.io/',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
  },
  [Chain.ArbitrumGoerli]: {
    name: 'Arbitrum Nitro Goerli Rollup Testnet',
    shortName: 'Arbitrum Goerli',
    chainId: 421613,
    network: Network.Arbitrum,
    walletRpcUrl: 'https://goerli-rollup.arbitrum.io/rpc',
    readRpcUrls: [`https://arbitrum-goerli.infura.io/v3/${INFURA_PROJECT_ID}`],
    blockExplorerUrl: 'https://goerli.arbiscan.io/',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
  },
}

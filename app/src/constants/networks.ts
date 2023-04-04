export { Network as LyraNetwork } from '@lyrafinance/lyra-js'
import { Network as LyraNetwork } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'
import nullthrows from 'nullthrows'

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
  rpcUrl: string
  blockExplorerUrl: string
  iconUrls: string[]
  gasBuffer: number
  maxGas: BigNumber
  minGas: BigNumber
  faucetUrl?: string
  nativeBridgeUrl?: string
  fastBridgeUrl?: string
}

const REACT_APP_OPTIMISM_MAINNET_RPC_URL = nullthrows(
  process.env.REACT_APP_OPTIMISM_MAINNET_RPC_URL,
  'REACT_APP_OPTIMISM_MAINNET_RPC_URL env var is not defined'
)
const REACT_APP_OPTIMISM_GOERLI_RPC_URL = nullthrows(
  process.env.REACT_APP_OPTIMISM_GOERLI_RPC_URL,
  'REACT_APP_OPTIMISM_GOERLI_RPC_URL env var is not defined'
)
const REACT_APP_ARBITRUM_MAINNET_RPC_URL = nullthrows(
  process.env.REACT_APP_ARBITRUM_MAINNET_RPC_URL,
  'REACT_APP_ARBITRUM_MAINNET_RPC_URL env var is not defined'
)
const REACT_APP_ARBITRUM_GOERLI_RPC_URL = nullthrows(
  process.env.REACT_APP_ARBITRUM_GOERLI_RPC_URL,
  'REACT_APP_ARBITRUM_GOERLI_RPC_URL env var is not defined'
)
const REACT_APP_ETHEREUM_MAINNET_RPC_URL = nullthrows(
  process.env.REACT_APP_ETHEREUM_MAINNET_RPC_URL,
  'REACT_APP_ETHEREUM_MAINNET_RPC_URL env var is not defined'
)
const REACT_APP_ETHEREUM_GOERLI_RPC_URL = nullthrows(
  process.env.REACT_APP_ETHEREUM_GOERLI_RPC_URL,
  'REACT_APP_ETHEREUM_GOERLI_RPC_URL env var is not defined'
)

export const NETWORK_CONFIGS: Record<AppChain, NetworkConfig> = {
  [AppChain.Optimism]: {
    name: 'Optimistic Ethereum',
    displayName: 'Optimism',
    chainId: 10,
    network: AppNetwork.Optimism,
    rpcUrl: REACT_APP_OPTIMISM_MAINNET_RPC_URL,
    blockExplorerUrl: 'https://optimistic.etherscan.io',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
    nativeBridgeUrl: 'https://app.optimism.io/bridge/withdraw',
    fastBridgeUrl: 'https://cbridge.celer.network/10/1/LYRA',
    gasBuffer: 1.5,
    minGas: BigNumber.from(22000),
    maxGas: BigNumber.from(15000000),
  },
  [AppChain.OptimismGoerli]: {
    name: 'Optimistic Ethereum (Goerli)',
    displayName: 'Optimistic Goerli',
    chainId: 420,
    network: AppNetwork.Optimism,
    rpcUrl: REACT_APP_OPTIMISM_GOERLI_RPC_URL,
    blockExplorerUrl: 'https://goerli-optimism.etherscan.io/',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
    faucetUrl: 'https://faucet.paradigm.xyz/',
    nativeBridgeUrl: 'https://app.optimism.io/bridge/withdraw',
    fastBridgeUrl: 'https://cbridge.celer.network/10/1/LYRA',
    gasBuffer: 1.5,
    minGas: BigNumber.from(22000),
    maxGas: BigNumber.from(15000000),
  },
  [AppChain.Arbitrum]: {
    name: 'Arbitrum One',
    displayName: 'Arbitrum',
    chainId: 42161,
    network: AppNetwork.Arbitrum,
    rpcUrl: REACT_APP_ARBITRUM_MAINNET_RPC_URL,
    blockExplorerUrl: 'https://arbiscan.io/',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
    nativeBridgeUrl: 'https://bridge.arbitrum.io/?l2ChainId=42161',
    fastBridgeUrl: 'https://cbridge.celer.network/42161/1/LYRA',
    gasBuffer: 1.5,
    minGas: BigNumber.from(22000),
    maxGas: BigNumber.from(30000000),
  },
  [AppChain.ArbitrumGoerli]: {
    name: 'Arbitrum Goerli',
    displayName: 'Arbitrum Goerli',
    chainId: 421613,
    network: AppNetwork.Arbitrum,
    rpcUrl: REACT_APP_ARBITRUM_GOERLI_RPC_URL,
    blockExplorerUrl: 'https://goerli.arbiscan.io/',
    iconUrls: ['https://optimism.io/images/metamask_icon.svg', 'https://optimism.io/images/metamask_icon.png'],
    faucetUrl: 'https://faucet.quicknode.com/arbitrum/goerli',
    nativeBridgeUrl: 'https://bridge.arbitrum.io/?l2ChainId=42161',
    fastBridgeUrl: 'https://cbridge.celer.network/42161/1/LYRA',
    gasBuffer: 1.5,
    minGas: BigNumber.from(22000),
    maxGas: BigNumber.from(30000000),
  },
  [AppChain.Ethereum]: {
    name: 'Ethereum Mainnet',
    displayName: 'Ethereum',
    chainId: 1,
    network: AppNetwork.Ethereum,
    rpcUrl: REACT_APP_ETHEREUM_MAINNET_RPC_URL,
    blockExplorerUrl: 'https://etherscan.io/',
    iconUrls: [],
    gasBuffer: 1.1,
    minGas: BigNumber.from(22000),
    maxGas: BigNumber.from(15000000),
  },
  [AppChain.EthereumGoerli]: {
    name: 'Ethereum Goerli',
    displayName: 'Ethereum Goerli',
    chainId: 5,
    network: AppNetwork.Ethereum,
    rpcUrl: REACT_APP_ETHEREUM_GOERLI_RPC_URL,
    blockExplorerUrl: 'https://goerli.etherscan.io/',
    iconUrls: [],
    gasBuffer: 1.1,
    minGas: BigNumber.from(22000),
    maxGas: BigNumber.from(15000000),
  },
}

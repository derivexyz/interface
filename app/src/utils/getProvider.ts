import { JsonRpcProvider } from '@ethersproject/providers'

import { AppNetwork, LyraNetwork, Network } from '../constants/networks'
import getLyraSDK from './getLyraSDK'
import mainnetProvider from './mainnetProvider'
import resolveNetwork from './resolveNetwork'

export default function getProvider(network: Network): JsonRpcProvider {
  switch (resolveNetwork(network)) {
    case AppNetwork.Ethereum:
      return mainnetProvider
    case AppNetwork.Arbitrum:
      return getLyraSDK(LyraNetwork.Arbitrum).provider
    case AppNetwork.Optimism:
      return getLyraSDK(LyraNetwork.Optimism).provider
  }
}

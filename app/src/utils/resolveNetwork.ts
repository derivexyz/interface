import { AppNetwork, LyraNetwork, Network } from '../constants/networks'
import coerce from './coerce'

export default function resolveNetwork(network: Network): AppNetwork {
  const lyraNetwork = coerce(LyraNetwork, network)
  if (lyraNetwork) {
    switch (lyraNetwork) {
      case LyraNetwork.Arbitrum:
        return AppNetwork.Arbitrum
      case LyraNetwork.Optimism:
        return AppNetwork.Optimism
    }
  } else {
    return network as AppNetwork
  }
}

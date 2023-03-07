import { Network } from '@lyrafinance/lyra-js'

import getNetworkConfig from '@/app/utils/getNetworkConfig'
import useDefaultNetwork from '@/app/utils/useDefaultNetwork'

import useWallet from './useWallet'

const getNetworkForChainId = (chainId: number): Network | null => {
  switch (chainId) {
    case getNetworkConfig(Network.Arbitrum).chainId:
      return Network.Arbitrum
    case getNetworkConfig(Network.Optimism).chainId:
      return Network.Optimism
    default:
      return null
  }
}

export default function useNetwork(): Network {
  const { chainId } = useWallet()
  const defaultNetwork = useDefaultNetwork()
  const walletNetwork = chainId ? getNetworkForChainId(chainId) : null
  const network = walletNetwork ? walletNetwork : defaultNetwork
  return network
}

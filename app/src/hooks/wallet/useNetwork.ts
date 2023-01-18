import { Network } from '@lyrafinance/lyra-js'

import getNetworkForChain from '@/app/utils/getNetworkForChain'
import useDefaultNetwork from '@/app/utils/useDefaultNetwork'

import useWallet from './useWallet'

export default function useNetwork(): Network {
  const { chain } = useWallet()
  const defaultNetwork = useDefaultNetwork()
  const network = chain ? getNetworkForChain(chain) : defaultNetwork
  return network
}

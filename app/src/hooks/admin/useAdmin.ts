import { Admin, Network } from '@lyrafinance/lyra-js'

import getLyraSDK from '@/app/utils/getLyraSDK'

import useWalletAccount from '../wallet/useWalletAccount'

export default function useAdmin(network: Network): Admin | null {
  const address = useWalletAccount()
  return address ? getLyraSDK(network).admin() : null
}

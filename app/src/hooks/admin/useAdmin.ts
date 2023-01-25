import { Admin, Network } from '@lyrafinance/lyra-js'

import getLyraSDK from '@/app/utils/getLyraSDK'

export default function useAdmin(network: Network): Admin {
  return getLyraSDK(network).admin()
}

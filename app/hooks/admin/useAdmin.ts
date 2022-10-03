import { Admin } from '@lyrafinance/lyra-js'

import lyra from '@/app/utils/lyra'

import useWalletAccount from '../wallet/useWalletAccount'

export default function useAdmin(): Admin | null {
  const address = useWalletAccount()
  return address ? lyra.admin() : null
}

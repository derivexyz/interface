import { Account } from '@lyrafinance/lyra-js'

import lyra from '@/app/utils/lyra'

import useWalletAccount from '../wallet/useWalletAccount'

export default function useAccount(): Account | null {
  const address = useWalletAccount()
  return address ? lyra.account(address) : null
}

import { FetchId } from '@/app/constants/fetch'
import { Network } from '@/app/constants/networks'
import getProvider from '@/app/utils/getProvider'

import useFetch from '../data/useFetch'
import useWalletAccount from './useWalletAccount'

const fetcher = async (network: Network, account: string): Promise<boolean> => {
  const code = await getProvider(network).getCode(account)
  return code !== '0x'
}

export default function useIsSmartContractWallet(network: Network): boolean {
  const account = useWalletAccount()
  const [isSmartContractWallet] = useFetch(
    FetchId.AccountIsSmartContractWallet,
    account ? [network, account] : null,
    fetcher
  )
  return !!isSmartContractWallet
}

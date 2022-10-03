import { ZERO_ADDRESS } from '@/app/constants/bn'
import lyra from '@/app/utils/lyra'

import useFetch from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'
import { fetchVaultBalance, VaultBalance } from './useVaultBalance'

const fetcher = async (owner: string): Promise<VaultBalance[]> => {
  const marketAddresses = await lyra.marketAddresses()
  const vaultBalances = await Promise.all(
    marketAddresses.map(async marketAddress => await fetchVaultBalance(owner, marketAddress))
  )
  return vaultBalances.filter(vaultBalance => vaultBalance.balance.balance.gt(0))
}

const EMPTY: VaultBalance[] = []

export default function useVaultBalances(): VaultBalance[] {
  const account = useWalletAccount() ?? ZERO_ADDRESS
  const [myVaultsLiquidity] = useFetch('VaultBalances', account ? [account] : null, fetcher)
  return myVaultsLiquidity ?? EMPTY
}

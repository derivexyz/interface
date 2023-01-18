import { Network } from '@lyrafinance/lyra-js'

import getLyraSDK from '@/app/utils/getLyraSDK'

import useFetch, { useMutate } from '../data/useFetch'
import useWallet from '../wallet/useWallet'
import { fetchVaultBalance, VaultBalance } from './useVaultBalance'

export type VaultTableRowData = VaultBalance

const fetcher = async (walletAddress?: string): Promise<VaultTableRowData[]> => {
  const rows = await Promise.all(
    Object.values(Network).map(async network => {
      const lyra = getLyraSDK(network)
      const marketAddresses = await lyra.marketAddresses()
      return await Promise.all(
        marketAddresses.map(marketAddress => fetchVaultBalance(lyra, marketAddress, walletAddress))
      )
    })
  )
  return rows.flat()
}

const EMPTY: VaultTableRowData[] = []

export default function useVaultsTableData(): VaultTableRowData[] {
  const { account } = useWallet()
  const [vaultStats] = useFetch('VaultsTableData', [account], fetcher)
  return vaultStats ?? EMPTY
}

export function useMutateVaultsTableData() {
  return useMutate('VaultsTableData', fetcher)
}

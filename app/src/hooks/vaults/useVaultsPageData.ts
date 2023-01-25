import { Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import { IGNORE_VAULTS_LIST } from '@/app/constants/ignore'
import { Vault } from '@/app/constants/vault'
import fetchVault from '@/app/utils/fetchVault'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useWallet from '../account/useWallet'
import useFetch, { useMutate } from '../data/useFetch'

const fetcher = async (walletAddress?: string): Promise<Vault[]> => {
  const vaults = await Promise.all(
    Object.values(Network).map(async network => {
      const lyra = getLyraSDK(network)
      const marketAddresses = await lyra.marketAddresses()
      return await Promise.all(marketAddresses.map(marketAddress => fetchVault(network, marketAddress, walletAddress)))
    })
  )
  return vaults
    .flat()
    .filter(
      vault =>
        !IGNORE_VAULTS_LIST.find(
          ({ marketName, chain }) => marketName === vault.market.name && chain === vault.market.lyra.chain
        ) || vault.liquidityToken.balance.gt(0)
    )
}

const EMPTY: Vault[] = []

export default function useVaultsPageData(): Vault[] {
  const { account } = useWallet()
  const [vaultStats] = useFetch(FetchId.VaultsTableData, [account], fetcher)
  return vaultStats ?? EMPTY
}

export function useMutateVaultsPageData() {
  const { account } = useWallet()
  const mutate = useMutate(FetchId.VaultsTableData, fetcher)
  return useCallback(() => mutate(account), [mutate, account])
}

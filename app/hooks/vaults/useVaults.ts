import lyra from '@/app/utils/lyra'

import useFetch from '../data/useFetch'
import { fetchVault, Vault } from './useVault'

const fetcher = async (): Promise<Vault[]> => {
  const marketAddresses = await lyra.marketAddresses()
  return await Promise.all(marketAddresses.map(marketAddress => fetchVault(marketAddress)))
}

const EMPTY: Vault[] = []

export default function useVaults(): Vault[] {
  const [poolsStats] = useFetch('AllVaults', [], fetcher)
  return poolsStats ?? EMPTY
}

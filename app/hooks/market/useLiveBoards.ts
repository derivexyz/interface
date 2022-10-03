import { Board } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import lyra from '../../utils/lyra'
import useFetch, { useMutate } from '../data/useFetch'

const fetcher = async (marketAddressOrName: string) =>
  (await lyra.market(marketAddressOrName)).liveBoards().sort((a, b) => a.expiryTimestamp - b.expiryTimestamp)

const EMPTY: Board[] = []

export default function useLiveBoards(marketAddressOrName: string | null): Board[] {
  const [boards] = useFetch('LiveBoards', marketAddressOrName ? [marketAddressOrName] : null, fetcher)
  return boards ?? EMPTY
}

export const useMutateLiveBoards = (marketAddressOrName: string | null): (() => Promise<Board[] | null>) => {
  const mutate = useMutate('LiveBoards', fetcher)
  return useCallback(
    async () => (marketAddressOrName ? await mutate(marketAddressOrName) : null),
    [mutate, marketAddressOrName]
  )
}

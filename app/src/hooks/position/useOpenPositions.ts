import { Position } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import lyra from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const EMPTY: Position[] = []

const fetcher = async (owner: string) =>
  (await lyra.openPositions(owner)).sort((a, b) => a.expiryTimestamp - b.expiryTimestamp)

export default function useOpenPositions(): Position[] {
  const account = useWalletAccount()
  const [positions] = useFetch('OpenPositions', account ? [account] : null, fetcher)
  return positions ?? EMPTY
}

export function useMutateOpenPositions() {
  const account = useWalletAccount()
  const mutate = useMutate('OpenPositions', fetcher)
  return useCallback(() => {
    if (account != null) {
      return mutate(account)
    }
  }, [mutate, account])
}

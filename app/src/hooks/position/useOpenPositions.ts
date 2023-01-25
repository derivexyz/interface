import { Network, Position } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

const EMPTY: Position[] = []

const fetcher = async (owner: string) => {
  const newtworkPositions = await Promise.all(
    Object.values(Network).map(network => getLyraSDK(network).openPositions(owner))
  )
  return newtworkPositions.flat().sort((a, b) => a.expiryTimestamp - b.expiryTimestamp)
}

export default function useOpenPositions(): Position[] {
  const account = useWalletAccount()
  const [positions] = useFetch(FetchId.PortfolioOpenPositions, account ? [account] : null, fetcher)
  return positions ?? EMPTY
}

export function useMutateOpenPositions() {
  const account = useWalletAccount()
  const mutate = useMutate(FetchId.PortfolioOpenPositions, fetcher)
  return useCallback(() => {
    if (account) {
      return mutate(account)
    }
  }, [mutate, account])
}

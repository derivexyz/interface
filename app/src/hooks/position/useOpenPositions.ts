import { Network, Position } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import getLyraSDK from '@/app/utils/getLyraSDK'
import { lyraArbitrum, lyraOptimism } from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const EMPTY: Position[] = []

const fetcher = async (owner: string, network?: Network) => {
  if (network) {
    return (await getLyraSDK(network).openPositions(owner)).sort((a, b) => a.expiryTimestamp - b.expiryTimestamp)
  }
  const [opPositions, arbPositions] = await Promise.all([
    lyraOptimism.openPositions(owner),
    lyraArbitrum.openPositions(owner),
  ])
  return [...opPositions, ...arbPositions].sort((a, b) => a.expiryTimestamp - b.expiryTimestamp)
}

export default function useOpenPositions(network?: Network): Position[] {
  const account = useWalletAccount()
  const [positions] = useFetch('OpenPositions', account ? [account, network] : null, fetcher)
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

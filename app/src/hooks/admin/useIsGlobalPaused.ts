import { Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import getLyraSDK from '@/app/utils/getLyraSDK'

import useFetch, { useMutate } from '../data/useFetch'

const fetcher = async (network: Network) => await getLyraSDK(network).admin().isGlobalPaused()

export default function useIsGlobalPaused(network: Network): boolean | null {
  const [isGlobalPaused] = useFetch('IsGlobalPaused', [network], fetcher)
  return isGlobalPaused
}

export const useMutateIsGlobalPaused = (network: Network): (() => Promise<boolean | null>) => {
  const mutate = useMutate('IsGlobalPaused', fetcher)
  return useCallback(async () => await mutate(network), [mutate, network])
}

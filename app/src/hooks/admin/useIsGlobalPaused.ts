import { useCallback } from 'react'

import lyra from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'

const fetcher = async () => await lyra.admin().isGlobalPaused()

export default function useIsGlobalPaused(): boolean | null {
  const [isGlobalPaused] = useFetch('IsGlobalPaused', [], fetcher)
  return isGlobalPaused
}

export const useMutateIsGlobalPaused = (): (() => Promise<boolean | null>) => {
  const mutate = useMutate('IsGlobalPaused', fetcher)
  return useCallback(async () => await mutate(), [mutate])
}

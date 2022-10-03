import { BigNumber } from '@ethersproject/bignumber'
import { useCallback } from 'react'

import lyra from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'

const fetcher = async (marketAddress: string) => {
  const market = await lyra.market(marketAddress)
  return await market.getShortBuffer()
}

export default function useShortBuffer(marketAddress: string): BigNumber | null {
  const [shortBuffer] = useFetch('ShortBuffer', [marketAddress], fetcher)
  return shortBuffer
}

export const useMutateShortBuffer = (marketAddress: string): (() => Promise<BigNumber | null>) => {
  const mutate = useMutate('ShortBuffer', fetcher)
  return useCallback(async () => await mutate(marketAddress), [mutate, marketAddress])
}

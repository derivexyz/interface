import { LyraStaking } from '@lyrafinance/lyra-js'

import { FetchId } from '@/app/constants/fetch'
import { lyraOptimism } from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'

export const fetchLyraStaking = async (): Promise<LyraStaking> => {
  return await lyraOptimism.lyraStaking()
}

export default function useLyraStaking(): LyraStaking | null {
  const [stake] = useFetch(FetchId.LyraStaking, [], fetchLyraStaking)
  return stake
}

export const useMutateLyraStaking = (): (() => Promise<LyraStaking | null>) => {
  const mutate = useMutate(FetchId.LyraStaking, fetchLyraStaking)
  return mutate
}

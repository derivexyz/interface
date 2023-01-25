import { LyraStaking } from '@lyrafinance/lyra-js'

import { FetchId } from '@/app/constants/fetch'
import { lyraOptimism } from '@/app/utils/lyra'

import useFetch from '../data/useFetch'

const fetchGlobalStaking = async (): Promise<LyraStaking> => await lyraOptimism.lyraStaking()

export default function useLyraStaking(): LyraStaking | null {
  const [lyraStaking] = useFetch(FetchId.LyraStaking, [], fetchGlobalStaking)
  return lyraStaking
}

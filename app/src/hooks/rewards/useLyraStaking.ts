import { LyraStaking } from '@lyrafinance/lyra-js'

import { lyraOptimism } from '@/app/utils/lyra'

import useFetch from '../data/useFetch'

const fetchGlobalStaking = async (): Promise<LyraStaking> => await lyraOptimism.lyraStaking()

export default function useLyraStaking(): LyraStaking | null {
  const [lyraStaking] = useFetch('LyraStaking', [], fetchGlobalStaking)
  return lyraStaking
}

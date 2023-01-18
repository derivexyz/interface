import { WethLyraStaking } from '@lyrafinance/lyra-js'

import { lyraOptimism } from '@/app/utils/lyra'

import useFetch from '../data/useFetch'

const fetchWethLyraStaking = async (): Promise<WethLyraStaking> => await lyraOptimism.wethLyraStaking()

export default function useWethLyraStaking(): WethLyraStaking | null {
  const [wethLyraStaking] = useFetch('WethLyraStaking', [], fetchWethLyraStaking)
  return wethLyraStaking
}

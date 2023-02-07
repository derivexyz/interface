import { WethLyraStaking } from '@lyrafinance/lyra-js'

import { FetchId } from '@/app/constants/fetch'
import { lyraOptimism } from '@/app/utils/lyra'

import useFetch from '../data/useFetch'

const fetchWethLyraStaking = async (): Promise<WethLyraStaking> => await lyraOptimism.wethLyraStaking()

export default function useWethLyraStaking(): WethLyraStaking | null {
  const [wethLyraStakingL2] = useFetch(FetchId.WethLyraStaking, [], fetchWethLyraStaking)
  return wethLyraStakingL2
}

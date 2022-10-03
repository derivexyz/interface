import { GlobalRewardEpoch } from '@lyrafinance/lyra-js'

import lyra from '../../utils/lyra'
import useFetch from '../data/useFetch'

export const fetchLatestGlobalRewardEpoch = async (): Promise<GlobalRewardEpoch> => {
  return lyra.latestGlobalRewardEpoch()
}

export default function useLatestGlobalRewardEpoch(): GlobalRewardEpoch | null {
  const [data] = useFetch('LatestGlobalRewardEpoch', [], fetchLatestGlobalRewardEpoch)
  return data ?? null
}

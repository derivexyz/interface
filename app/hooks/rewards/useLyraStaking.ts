import { LyraStaking } from '@lyrafinance/lyra-js'

import lyra from '../../utils/lyra'
import useFetch from '../data/useFetch'

const fetchGlobalStaking = async (): Promise<LyraStaking> => await lyra.lyraStaking()

export default function useLyraStaking(): LyraStaking | null {
  const [lyraStaking] = useFetch('LyraStaking', [], fetchGlobalStaking)
  return lyraStaking
}

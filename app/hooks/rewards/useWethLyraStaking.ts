import { WethLyraStaking } from '@lyrafinance/lyra-js'

import lyra from '../../utils/lyra'
import useFetch from '../data/useFetch'

const fetchWethLyraStaking = async (): Promise<WethLyraStaking> => await lyra.wethLyraStaking()

export default function useWethLyraStaking(): WethLyraStaking | null {
  const [wethLyraStaking] = useFetch('WethLyraStaking', [], fetchWethLyraStaking)
  return wethLyraStaking
}

import fromBigNumber from '@/app/utils/fromBigNumber'
import lyra from '@/app/utils/lyra'

import useFetch from '../data/useFetch'

const fetcher = async (): Promise<number> => {
  const startTimestamp = Math.floor(new Date().getTime() / 1000) - 30 * 24 * 60 * 60
  const markets = await lyra.markets()
  const marketVolumes = await Promise.all(
    markets.map(async market => {
      const tradingVolumeHistory = await market.tradingVolumeHistory({ startTimestamp })
      const totalVolume30dAgo = fromBigNumber(tradingVolumeHistory[0].totalNotionalVolume)
      const totalVolume = fromBigNumber(tradingVolumeHistory[tradingVolumeHistory.length - 1].totalNotionalVolume)
      const volume = totalVolume - totalVolume30dAgo
      return volume
    })
  )
  return marketVolumes.reduce((sum, marketVolume) => sum + marketVolume, 0)
}

const useTotalTradingVolume = (): number => {
  const [totalVolume] = useFetch('TotalTradingVolume', [], fetcher)
  return totalVolume ?? 0
}

export default useTotalTradingVolume

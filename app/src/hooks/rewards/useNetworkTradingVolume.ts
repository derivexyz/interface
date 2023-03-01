import { Network } from '@lyrafinance/lyra-js'

import { FetchId } from '@/app/constants/fetch'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useFetch from '../data/useFetch'

type NetworkTradingVolumeData = {
  totalShortOpenInterestUSD: number
  totalNotionalVolume: number
}

const EMPTY: NetworkTradingVolumeData = {
  totalShortOpenInterestUSD: 0,
  totalNotionalVolume: 0,
}

const fetcher = async (network: Network): Promise<NetworkTradingVolumeData> => {
  const markets = await getLyraSDK(network).markets()
  const volumes = await Promise.all(markets.map(market => market.tradingVolumeHistory()))
  const totalShortOpenInterestUSD = volumes.reduce(
    (totalShortOI, volume) => totalShortOI + fromBigNumber(volume[volume.length - 1].totalShortOpenInterestUSD),
    0
  )
  const totalNotionalVolume = volumes.reduce(
    (totalNetworkVolume, volume) => totalNetworkVolume + fromBigNumber(volume[volume.length - 1].totalNotionalVolume),
    0
  )
  return {
    totalShortOpenInterestUSD,
    totalNotionalVolume,
  }
}

export default function useNetworkTradingVolume(network: Network) {
  const [data] = useFetch(FetchId.NetworkTradingVolume, [network], fetcher)
  return data ?? EMPTY
}

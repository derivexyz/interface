import { AdminMarketGlobalCache, Market, Network } from '@lyrafinance/lyra-js'

import { FetchId } from '@/app/constants/fetch'
import getLyraSDK from '@/app/utils/getLyraSDK'
import { lyraAvalon } from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'

type AdminRoot = {
  marketsWithGlobalCaches: {
    market: Market
    globalCache: AdminMarketGlobalCache
  }[]
}

const fetcher = async (): Promise<AdminRoot> => {
  const avalonMarkets = await lyraAvalon.markets()
  const markets = (await Promise.all(Object.values(Network).map(network => getLyraSDK(network).markets())))
    .flat()
    .concat(avalonMarkets)

  const marketsWithGlobalCaches = (
    await Promise.all(markets.map(m => m.lyra.admin().getMarketGlobalCache(m.address)))
  ).map((globalCache, idx) => ({
    market: markets[idx],
    globalCache,
  }))

  return {
    marketsWithGlobalCaches,
  }
}

const EMPTY: AdminRoot = {
  marketsWithGlobalCaches: [],
}

export default function useAdminPageData(): AdminRoot {
  const [admin] = useFetch(FetchId.AdminPageData, [], fetcher)
  return admin ?? EMPTY
}

export const useMutateAdminPageData = () => {
  return useMutate(FetchId.AdminPageData, fetcher)
}

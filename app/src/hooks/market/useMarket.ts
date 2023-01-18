import { Market, Network } from '@lyrafinance/lyra-js'

import getLyraSDK from '@/app/utils/getLyraSDK'

import useFetch from '../data/useFetch'

const fetchMarket = async (network: Network, marketAddressOrName: string): Promise<Market> => {
  const market = await getLyraSDK(network).market(marketAddressOrName)
  return market
}

export default function useMarket(network: Network | null, marketAddressOrName: string | null): Market | null {
  const [market] = useFetch(
    'Market',
    network && marketAddressOrName ? [network, marketAddressOrName] : null,
    fetchMarket
  )
  return market
}

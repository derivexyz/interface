import lyra from '../../utils/lyra'
import useFetch from '../data/useFetch'

const fetcher = async (marketAddressesOrName: string) => {
  const market = await lyra.market(marketAddressesOrName)
  return await market.owner()
}

export default function useMarketOwner(marketAddressesOrName: string | null): string | null {
  const [owner] = useFetch('MarketOwner', marketAddressesOrName ? [marketAddressesOrName] : null, fetcher)
  return owner
}

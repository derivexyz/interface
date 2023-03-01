import { LYRA_API_URL } from '../constants/links'
import { Network } from '../constants/network'
import fetchWithCache from './fetchWithCache'

export default async function fetchTokenSpotPrice(
  tokenAddressOrName: string,
  network: Network | 'ethereum'
): Promise<number> {
  const url = new URL(`/token-price?tokenAddressOrName=${tokenAddressOrName}&network=${network}`, LYRA_API_URL)
  const res = await fetchWithCache<{ spotPrice: number }>(url.toString())
  return res.spotPrice
}

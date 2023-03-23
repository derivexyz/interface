import { Network } from '../../constants/networks'

const LYRA_API_URL = process.env.REACT_APP_API_URL

export async function fetchTokenSpotPrice(tokenAddressOrName: string, network: Network | 'ethereum'): Promise<number> {
  const url = new URL(`/token-price?tokenAddressOrName=${tokenAddressOrName}&network=${network}`, LYRA_API_URL)
  const res = await fetch(url.toString())
  const resJson = await res.json()
  return resJson.spotPrice
}

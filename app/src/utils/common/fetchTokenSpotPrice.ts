import { AppNetwork } from '../../constants/networks'

const LYRA_API_URL = process.env.REACT_APP_API_URL

export default async function fetchTokenSpotPrice(tokenAddressOrName: string, network: AppNetwork): Promise<number> {
  const url = new URL(`/token-price?tokenAddressOrName=${tokenAddressOrName}&network=${network}`, LYRA_API_URL)
  const res = await fetch(url.toString())
  const resJson = await res.json()
  return resJson.spotPrice
}

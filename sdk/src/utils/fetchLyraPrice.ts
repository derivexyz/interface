import { LYRA_API_URL } from '../constants/links'
import fetchWithCache from './fetchWithCache'

export default async function fetchLyraPrice(): Promise<number> {
  const res = await fetchWithCache<{ spotPrice: number }>(`${LYRA_API_URL}/lyra-price`)
  return res.spotPrice
}

import spindl from '@spindl-xyz/attribution-lite'

import { FetchId } from '@/app/constants/fetch'

import useFetch from '../data/useFetch'

export const fetchReferrerAttribution = async (address: string): Promise<string | null> =>
  await spindl.getReferrerAttribution(address)

export default function useReferrerAttribution(address: string): string | null {
  const [data] = useFetch(FetchId.ReferralCode, address ? [address] : null, fetchReferrerAttribution)
  return data
}

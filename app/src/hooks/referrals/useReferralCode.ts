import spindl from '@spindl-xyz/attribution-lite'

import { FetchId } from '@/app/constants/fetch'

import useFetch from '../data/useFetch'
import useQueryParam from '../url/useQueryParam'

export const fetchReferralCode = async (code: string): Promise<string> => {
  const referrerCode = await spindl.getReferrerAddress(code)
  return referrerCode
}

export default function useReferralCode(): string | null {
  const [referrer, _setReferrer] = useQueryParam('ref')
  const [data] = useFetch(FetchId.ReferralCode, referrer ? [referrer] : null, fetchReferralCode)
  return data
}

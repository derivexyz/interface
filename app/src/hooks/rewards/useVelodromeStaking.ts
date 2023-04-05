import { FetchId } from '@/app/constants/fetch'
import fetchVelodromeStaking from '@/app/utils/fetchVelodromeStaking'

import useWalletAccount from '../account/useWalletAccount'
import useFetch from '../data/useFetch'

export default function useVelodromeStaking() {
  const account = useWalletAccount()
  const [data] = useFetch(FetchId.VelodromeStaking, [account], fetchVelodromeStaking)
  return data
}

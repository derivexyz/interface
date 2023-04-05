import { FetchId } from '@/app/constants/fetch'
import fetchCamelotStaking from '@/app/utils/fetchCamelotStaking'

import useWalletAccount from '../account/useWalletAccount'
import useFetch from '../data/useFetch'

export default function useCamelotStaking() {
  const account = useWalletAccount()
  const [data] = useFetch(FetchId.CamelotStaking, [account], fetchCamelotStaking)
  return data
}

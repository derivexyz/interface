import { FetchId } from '@/app/constants/fetch'
import fetchArrakisOptimismStaking, { ArrakisOpStaking } from '@/app/utils/rewards/fetchArrakisOptimismAccount'
import fetchArrakisStaking, { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'

import useWalletAccount from '../account/useWalletAccount'
import useFetch from '../data/useFetch'

type RewardsArrakisPageData = {
  arrakisStaking: ArrakisStaking | null
  arrakisOpStaking: ArrakisOpStaking | null
}

const EMPTY: RewardsArrakisPageData = {
  arrakisStaking: null,
  arrakisOpStaking: null,
}

const fetcher = async (address: string | null): Promise<RewardsArrakisPageData> => {
  const [arrakisStaking, arrakisOpStaking] = await Promise.all([
    fetchArrakisStaking(address),
    address ? fetchArrakisOptimismStaking(address) : null,
  ])
  return {
    arrakisStaking,
    arrakisOpStaking,
  }
}

export default function useRewardsArrakisPageData(): RewardsArrakisPageData {
  const account = useWalletAccount()
  const [data] = useFetch(FetchId.RewardsArrakisPageData, [account], fetcher)
  return data ?? EMPTY
}

import { AccountWethLyraStaking, WethLyraStaking } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'

import { ZERO_BN } from '@/app/constants/bn'
import { FetchId } from '@/app/constants/fetch'
import { lyraOptimism } from '@/app/utils/lyra'

import useWalletAccount from '../account/useWalletAccount'
import useFetch from '../data/useFetch'

type RewardsEthLyraLPPageData = {
  wethLyraStaking: WethLyraStaking | null
  accountWethLyraStaking: AccountWethLyraStaking | null
  accountWethLyraStakingL2: AccountWethLyraStaking | null
  claimableBalance: BigNumber
}

const EMPTY: RewardsEthLyraLPPageData = {
  wethLyraStaking: null,
  accountWethLyraStaking: null,
  accountWethLyraStakingL2: null,
  claimableBalance: ZERO_BN,
}

const fetcher = async (address: string | null): Promise<RewardsEthLyraLPPageData> => {
  const [wethLyraStaking, accountWethLyraStaking, claimableBalance, accountWethLyraStakingL2] = await Promise.all([
    lyraOptimism.wethLyraStaking(),
    address ? lyraOptimism.wethLyraStakingAccount(address) : null,
    address ? lyraOptimism.claimableWethLyraRewards(address) : ZERO_BN,
    address ? WethLyraStaking.getByOwnerL2(lyraOptimism, address) : null,
  ])
  return {
    wethLyraStaking,
    accountWethLyraStaking,
    accountWethLyraStakingL2,
    claimableBalance,
  }
}

export default function useRewardsEthLyraLPPageData(): RewardsEthLyraLPPageData {
  const account = useWalletAccount()
  const [data] = useFetch(FetchId.RewardsEthLyraLPPageData, [account], fetcher)
  return data ?? EMPTY
}

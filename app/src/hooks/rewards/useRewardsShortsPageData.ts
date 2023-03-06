import { Network } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'

import { ZERO_ADDRESS, ZERO_BN } from '@/app/constants/bn'
import { FetchId } from '@/app/constants/fetch'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useWalletAccount from '../account/useWalletAccount'
import useFetch from '../data/useFetch'
import { EMPTY_REWARDS_PAGE_DATA, fetchRewardsPageData, RewardsPageData } from './useRewardsPageData'

const EMPTY = {
  ...EMPTY_REWARDS_PAGE_DATA,
  collateral: ZERO_BN,
}

type RewardsShortPageData = RewardsPageData & {
  collateral: BigNumber
}

const fetcher = async (account: string, network: Network): Promise<RewardsShortPageData> => {
  const lyra = getLyraSDK(network)
  const [rewardPageData, positions] = await Promise.all([fetchRewardsPageData(account), lyra.positions(account)])
  const latestGlobalRewardEpoch = rewardPageData.epochs[network]?.latestRewardEpoch.global

  return {
    ...rewardPageData,
    collateral: latestGlobalRewardEpoch
      ? positions
          .filter(p => !p.isLong && (!p.closeTimestamp || p.closeTimestamp > latestGlobalRewardEpoch.startTimestamp))
          .reduce((sum, position) => sum.add(position.collateral?.value ?? ZERO_BN), ZERO_BN)
      : ZERO_BN,
  }
}

export default function useRewardsShortsPageData(network: Network | null): RewardsShortPageData {
  const account = useWalletAccount()
  const [data] = useFetch(FetchId.RewardsShortsPageData, network ? [account ?? ZERO_ADDRESS, network] : null, fetcher)
  return data ?? EMPTY
}

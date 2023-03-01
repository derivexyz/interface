import { Network } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'

import { ZERO_ADDRESS, ZERO_BN } from '@/app/constants/bn'
import { FetchId } from '@/app/constants/fetch'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useWalletAccount from '../account/useWalletAccount'
import useFetch from '../data/useFetch'
import { fetchRewardsPageData, RewardsPageData } from './useRewardsPageData'

const EMPTY = {
  epochs: {},
  wethLyraStaking: null,
  collateral: ZERO_BN,
}

type RewardsShortPageData = RewardsPageData & {
  collateral: BigNumber
}

const fetcher = async (account: string, network: Network): Promise<RewardsShortPageData> => {
  const lyra = getLyraSDK(network)
  const [rewardPageData, openPositions] = await Promise.all([
    fetchRewardsPageData(account),
    lyra.openPositions(account),
  ])
  return {
    ...rewardPageData,
    collateral: openPositions.reduce((sum, position) => sum.add(position.collateral?.value ?? ZERO_BN), ZERO_BN),
  }
}

export default function useRewardsShortsPageData(network: Network | null): RewardsShortPageData {
  const account = useWalletAccount()
  const [data] = useFetch(FetchId.RewardsShortsPageData, network ? [account ?? ZERO_ADDRESS, network] : null, fetcher)
  return data ?? EMPTY
}

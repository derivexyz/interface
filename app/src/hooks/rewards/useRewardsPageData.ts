import {
  AccountLyraBalances,
  AccountRewardEpoch,
  ClaimableBalanceL2,
  GlobalRewardEpoch,
  LyraStakingAccount,
  Network,
} from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import fetchCamelotStaking, { CamelotStaking } from '@/app/utils/fetchCamelotStaking'
import fetchVelodromeStaking, { VelodromeStaking } from '@/app/utils/fetchVelodromeStaking'
import getLyraSDK from '@/app/utils/getLyraSDK'
import { lyraOptimism } from '@/app/utils/lyra'
import fetchArrakisStaking, { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'

import { EMPTY_LYRA_BALANCES } from '../account/useAccountLyraBalances'
import useWallet from '../account/useWallet'
import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'
import { LatestRewardEpoch } from './useLatestRewardEpoch'

type NetworkRewardsData = {
  globalRewardEpochs: GlobalRewardEpoch[]
  accountRewardEpochs: AccountRewardEpoch[]
  latestRewardEpoch: LatestRewardEpoch
}

export type RewardsPageData = {
  epochs: {
    [network in Network]?: NetworkRewardsData
  }
  lyraBalances: AccountLyraBalances
  arrakisStaking: ArrakisStaking | null
  camelotStaking: CamelotStaking | null
  velodromeStaking: VelodromeStaking | null
  lyraStakingAccount: LyraStakingAccount | null
  claimableOptimismRewards: ClaimableBalanceL2 | null
}

export const EMPTY_REWARDS_PAGE_DATA: RewardsPageData = {
  epochs: {},
  lyraBalances: EMPTY_LYRA_BALANCES,
  arrakisStaking: null,
  camelotStaking: null,
  velodromeStaking: null,
  lyraStakingAccount: null,
  claimableOptimismRewards: null,
}

export const fetchRewardsPageData = async (walletAddress: string | null): Promise<RewardsPageData> => {
  const [
    globalRewardEpochs,
    accountRewardEpochs,
    arrakisStaking,
    camelotStaking,
    velodromeStaking,
    lyraBalances,
    lyraStakingAccount,
    claimableOptimismRewards,
  ] = await Promise.all([
    Promise.all(Object.values(Network).map(network => getLyraSDK(network).globalRewardEpochs())),
    walletAddress
      ? Promise.all(Object.values(Network).map(network => getLyraSDK(network).accountRewardEpochs(walletAddress)))
      : [],
    fetchArrakisStaking(walletAddress),
    fetchCamelotStaking(walletAddress),
    fetchVelodromeStaking(walletAddress),
    walletAddress ? lyraOptimism.account(walletAddress).lyraBalances() : EMPTY_LYRA_BALANCES,
    walletAddress ? lyraOptimism.lyraStakingAccount(walletAddress) : null,
    walletAddress ? lyraOptimism.claimableRewards(walletAddress) : null,
  ])

  const networkEpochsMap = Object.values(Network).reduce((map, network, idx) => {
    const networkGlobalEpochs = globalRewardEpochs[idx]
    const networkAccountRewardEpochs = accountRewardEpochs[idx]
    const matchedRewardEpochs = networkGlobalEpochs
      .map(globalEpoch => ({
        account:
          networkAccountRewardEpochs?.find(
            accountEpoch => accountEpoch.globalEpoch.startTimestamp === globalEpoch.startTimestamp
          ) ?? null,
        global: globalEpoch,
      }))
      .sort((a, b) => b.global.endTimestamp - a.global.endTimestamp)
    return {
      ...map,
      [network]: {
        globalRewardEpochs: networkGlobalEpochs,
        accountRewardEpochs: networkAccountRewardEpochs,
        latestRewardEpoch: matchedRewardEpochs[0],
      },
    }
  }, {})

  return {
    epochs: networkEpochsMap,
    lyraBalances,
    lyraStakingAccount,
    claimableOptimismRewards,
    arrakisStaking,
    camelotStaking,
    velodromeStaking,
  }
}

export default function useRewardsPageData(): RewardsPageData {
  const account = useWalletAccount()
  const [rewardsPageData] = useFetch(FetchId.RewardsPageData, [account], fetchRewardsPageData, {
    refreshInterval: 30 * 1000,
  })
  return rewardsPageData ?? EMPTY_REWARDS_PAGE_DATA
}

export function useMutateRewardsPageData() {
  const { account } = useWallet()
  const mutate = useMutate(FetchId.RewardsPageData, fetchRewardsPageData)
  return useCallback(() => (account ? mutate(account) : null), [mutate, account])
}

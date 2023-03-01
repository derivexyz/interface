import { AccountRewardEpoch, GlobalRewardEpoch, Network, WethLyraStaking } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import getLyraSDK from '@/app/utils/getLyraSDK'
import { lyraOptimism } from '@/app/utils/lyra'

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
  wethLyraStaking: WethLyraStaking | null
  epochs: {
    [network in Network]?: NetworkRewardsData
  }
}

const EMPTY: RewardsPageData = {
  wethLyraStaking: null,
  epochs: {},
}

export const fetchRewardsPageData = async (walletAddress: string | null): Promise<RewardsPageData> => {
  const [globalRewardEpochs, accountRewardEpochs, wethLyraStaking] = await Promise.all([
    Promise.all(Object.values(Network).map(network => getLyraSDK(network).globalRewardEpochs())),
    walletAddress
      ? Promise.all(Object.values(Network).map(network => getLyraSDK(network).accountRewardEpochs(walletAddress)))
      : [],
    lyraOptimism.wethLyraStaking(),
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
    wethLyraStaking,
  }
}

export default function useRewardsPageData(): RewardsPageData {
  const account = useWalletAccount()
  const [rewardsPageData] = useFetch(FetchId.RewardsPageData, [account], fetchRewardsPageData, {
    refreshInterval: 30 * 1000,
  })
  return rewardsPageData ?? EMPTY
}

export function useMutateRewardsPageData() {
  const { account } = useWallet()
  const mutate = useMutate(FetchId.RewardsPageData, fetchRewardsPageData)
  return useCallback(() => (account ? mutate(account) : null), [mutate, account])
}

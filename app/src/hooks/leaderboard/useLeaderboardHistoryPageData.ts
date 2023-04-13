import { AccountRewardEpoch, GlobalRewardEpoch, Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import getLyraSDK from '@/app/utils/getLyraSDK'

import useNetwork from '../account/useNetwork'
import useWallet from '../account/useWallet'
import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'
import { fetchAccountRewardEpochs } from '../rewards/useAccountRewardEpochs'

export type LeaderboardHistoryPageData = {
  latestGlobalRewardEpoch: GlobalRewardEpoch
  latestAccountRewardEpoch?: AccountRewardEpoch
  globalRewardEpochs: GlobalRewardEpoch[]
  accountRewardEpochs: AccountRewardEpoch[]
}

export const fetchLeaderboardHistoryPageData = async (
  network: Network,
  walletAddress: string | null
): Promise<LeaderboardHistoryPageData> => {
  const [globalRewardEpochs, accountRewardEpochs] = await Promise.all([
    getLyraSDK(network).globalRewardEpochs(),
    walletAddress ? fetchAccountRewardEpochs(walletAddress, network) : [],
  ])

  let latestGlobalRewardEpoch: GlobalRewardEpoch
  const currGlobalRewardEpoch = globalRewardEpochs.find(e => e.isCurrent)
  if (currGlobalRewardEpoch) {
    latestGlobalRewardEpoch = currGlobalRewardEpoch
  } else if (globalRewardEpochs.length > 0) {
    // If no current epoch is available, use latest epoch less than current timestamp
    latestGlobalRewardEpoch = globalRewardEpochs.sort((a, b) => b.endTimestamp - a.endTimestamp)[0]
  } else {
    throw new Error('No global epochs for network')
  }
  const latestAccountRewardEpoch = accountRewardEpochs.find(
    e => e.globalEpoch.startTimestamp === latestGlobalRewardEpoch.startTimestamp
  )

  return {
    globalRewardEpochs: globalRewardEpochs,
    latestGlobalRewardEpoch,
    accountRewardEpochs: accountRewardEpochs,
    latestAccountRewardEpoch,
  }
}

export default function useLeaderboardHistoryPageData(): LeaderboardHistoryPageData | null {
  const account = useWalletAccount()
  const network = useNetwork()
  const [leaderboardPageData] = useFetch(
    FetchId.LeaderboardHistoryPageData,
    [network, account],
    fetchLeaderboardHistoryPageData
  )
  return leaderboardPageData
}

export function useMutateLeaderboardHistoryPageData() {
  const { account } = useWallet()
  const network = useNetwork()
  const mutate = useMutate(FetchId.LeaderboardHistoryPageData, fetchLeaderboardHistoryPageData)
  return useCallback(() => (account ? mutate(network, account) : null), [account, mutate, network])
}

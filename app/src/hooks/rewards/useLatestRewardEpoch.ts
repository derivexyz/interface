import { AccountRewardEpoch, GlobalRewardEpoch, Network } from '@lyrafinance/lyra-js'

import { FetchId } from '@/app/constants/fetch'

import getLyraSDK from '../../utils/getLyraSDK'
import useWalletAccount from '../account/useWalletAccount'
import useFetch from '../data/useFetch'
import { fetchAccountRewardEpochs } from './useAccountRewardEpochs'

type LatestRewardEpoch = {
  global: GlobalRewardEpoch
  account?: AccountRewardEpoch | null
}

export const fetchLatestRewardEpoch = async (
  network: Network,
  address: string | null,
  sortByAscending?: boolean
): Promise<LatestRewardEpoch | null> => {
  const sdk = getLyraSDK(network)
  const [globalRewardEpochs, accountRewardEpochs] = await Promise.all([
    sdk.globalRewardEpochs(),
    address ? fetchAccountRewardEpochs(address, network) : [],
  ])
  return (
    globalRewardEpochs
      .map(global => {
        const account =
          accountRewardEpochs.find(epoch => epoch.globalEpoch.startTimestamp === global.startTimestamp) ?? null
        return { account, global }
      })
      .sort((a, b) =>
        sortByAscending ? a.global.endTimestamp - b.global.endTimestamp : b.global.endTimestamp - a.global.endTimestamp
      )
      .find(({ account, global }) => account?.isPendingRewards || global.isCurrent) ?? null
  )
}

export default function useLatestRewardEpoch(network: Network, sortByDescending?: boolean): LatestRewardEpoch | null {
  const account = useWalletAccount()
  const [data] = useFetch(FetchId.LatestRewardEpoch, [network, account, sortByDescending], fetchLatestRewardEpoch)
  return data ?? null
}

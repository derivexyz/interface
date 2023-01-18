import { AccountRewardEpoch, GlobalRewardEpoch, Network } from '@lyrafinance/lyra-js'

import getLyraSDK from '../../utils/getLyraSDK'
import useFetch from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'
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
  const [data] = useFetch('LatestRewardEpoch', [network, account, sortByDescending], fetchLatestRewardEpoch)
  return data ?? null
}

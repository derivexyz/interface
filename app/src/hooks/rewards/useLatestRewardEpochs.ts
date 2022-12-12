import { AccountRewardEpoch, Deployment, GlobalRewardEpoch } from '@lyrafinance/lyra-js'

import lyra from '../../utils/lyra'
import useFetch from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'
import { fetchAccountRewardEpochs } from './useAccountRewardEpochs'

type LatestRewardEpochs = {
  global: GlobalRewardEpoch
  account?: AccountRewardEpoch | null
}

export const fetchLatestRewardEpochs = async (
  address?: string,
  sortByDescending?: boolean
): Promise<LatestRewardEpochs | null> => {
  const [globalRewardEpochs, accountRewardEpochs] = await Promise.all([
    lyra.deployment === Deployment.Mainnet ? lyra.globalRewardEpochs() : [],
    address ? fetchAccountRewardEpochs(address) : [],
  ])
  return (
    globalRewardEpochs
      .map(global => {
        const account =
          accountRewardEpochs.find(epoch => epoch.globalEpoch.startTimestamp === global.startTimestamp) ?? null
        return { account, global }
      })
      .sort((a, b) =>
        sortByDescending ? b.global.endTimestamp - a.global.endTimestamp : a.global.endTimestamp - b.global.endTimestamp
      )
      .find(({ account, global }) => account?.isPendingRewards || global.isCurrent) ?? null
  )
}

export default function useLatestRewardEpochs(sortByDescending?: boolean): LatestRewardEpochs | null {
  const account = useWalletAccount()
  const [data] = useFetch('LatestRewardEpochs', account ? [account, sortByDescending] : [], fetchLatestRewardEpochs)
  return data ?? null
}

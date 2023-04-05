import {
  AccountLyraBalances,
  AccountRewardEpoch,
  GlobalRewardEpoch,
  LyraStaking,
  LyraStakingAccount,
  Network,
} from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import { Vault } from '@/app/constants/vault'
import getLyraSDK from '@/app/utils/getLyraSDK'
import { lyraOptimism } from '@/app/utils/lyra'

import { EMPTY_LYRA_BALANCES } from '../account/useAccountLyraBalances'
import useWallet from '../account/useWallet'
import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'
import { fetchVaults } from '../vaults/useVaultsPageData'

export type LatestRewardEpoch = {
  global: GlobalRewardEpoch
  account?: AccountRewardEpoch | null
}

type NetworkRewardsData = {
  vaults: Vault[]
  globalRewardEpochs: GlobalRewardEpoch[]
  accountRewardEpochs: AccountRewardEpoch[]
  latestRewardEpoch: LatestRewardEpoch
}

export type RewardsPageData = {
  epochs: Record<Network, NetworkRewardsData>
  vaults: Vault[]
  lyraStaking: LyraStaking
  lyraBalances: AccountLyraBalances
  lyraStakingAccount: LyraStakingAccount | null
}

export const fetchRewardsPageData = async (walletAddress: string | null): Promise<RewardsPageData> => {
  const [globalRewardEpochs, accountRewardEpochs, vaults, lyraStaking, lyraBalances, lyraStakingAccount] =
    await Promise.all([
      Promise.all(Object.values(Network).map(network => getLyraSDK(network).globalRewardEpochs())),
      walletAddress
        ? Promise.all(Object.values(Network).map(network => getLyraSDK(network).accountRewardEpochs(walletAddress)))
        : [],
      fetchVaults(walletAddress ?? undefined),
      lyraOptimism.lyraStaking(),
      walletAddress ? lyraOptimism.account(walletAddress).lyraBalances() : EMPTY_LYRA_BALANCES,
      walletAddress ? lyraOptimism.lyraStakingAccount(walletAddress) : null,
    ])

  const networkEpochsMap = Object.values(Network).reduce((map, network, idx) => {
    const networkGlobalEpochs = globalRewardEpochs[idx] ?? []
    const networkAccountRewardEpochs = accountRewardEpochs[idx] ?? []

    let latestGlobalRewardEpoch: GlobalRewardEpoch
    const currGlobalRewardEpoch = networkGlobalEpochs.find(e => e.isCurrent)
    if (currGlobalRewardEpoch) {
      latestGlobalRewardEpoch = currGlobalRewardEpoch
    } else if (networkGlobalEpochs.length > 0) {
      // If no current epoch is available, use latest epoch less than current timestamp
      latestGlobalRewardEpoch = networkGlobalEpochs.sort((a, b) => b.endTimestamp - a.endTimestamp)[0]
    } else {
      throw new Error('No global epochs for network')
    }

    const latestAccountRewardEpoch = networkAccountRewardEpochs.find(
      e => e.globalEpoch.startTimestamp === latestGlobalRewardEpoch.startTimestamp
    )

    return {
      ...map,
      [network]: {
        globalRewardEpochs: networkGlobalEpochs,
        accountRewardEpochs: networkAccountRewardEpochs,
        latestRewardEpoch: {
          global: latestGlobalRewardEpoch,
          account: latestAccountRewardEpoch,
        },
      },
    }
  }, {} as Record<Network, NetworkRewardsData>)

  return {
    epochs: networkEpochsMap,
    vaults,
    lyraBalances,
    lyraStaking,
    lyraStakingAccount,
  }
}

export default function useRewardsPageData(): RewardsPageData | null {
  const account = useWalletAccount()
  const [rewardsPageData] = useFetch(FetchId.RewardsPageData, [account], fetchRewardsPageData)
  return rewardsPageData
}

export function useMutateRewardsPageData() {
  const { account } = useWallet()
  const mutate = useMutate(FetchId.RewardsPageData, fetchRewardsPageData)
  return useCallback(() => (account ? mutate(account) : null), [mutate, account])
}

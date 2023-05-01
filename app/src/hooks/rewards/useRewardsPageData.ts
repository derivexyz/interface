import { AccountRewardEpoch, GlobalRewardEpoch, Network } from '@lyrafinance/lyra-js'
import { NewTradingRewardsReferredTraders } from '@lyrafinance/lyra-js/src/utils/fetchAccountRewardEpochData'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import { Vault } from '@/app/constants/vault'
import fetchLyraBalances, { LyraBalances } from '@/app/utils/common/fetchLyraBalances'
import getLyraSDK from '@/app/utils/getLyraSDK'
import fetchLyraStaking, { LyraStaking } from '@/app/utils/rewards/fetchLyraStaking'

import useWallet from '../account/useWallet'
import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'
import { fetchVaults } from '../vaults/useVaultsPageData'

export type LatestRewardEpoch = {
  global: GlobalRewardEpoch
  account?: AccountRewardEpoch | null
}

export type NetworkRewardsData = {
  vaults: Vault[]
  globalRewardEpochs: GlobalRewardEpoch[]
  accountRewardEpochs: AccountRewardEpoch[]
  latestRewardEpoch: LatestRewardEpoch
}

export type RewardsPageData = {
  epochs: Record<Network, NetworkRewardsData>
  vaults: Vault[]
  lyraStaking: LyraStaking
  lyraBalances: LyraBalances
  referredTraders: NewTradingRewardsReferredTraders
}

export const fetchRewardsPageData = async (walletAddress: string | null): Promise<RewardsPageData> => {
  const referredTraders: NewTradingRewardsReferredTraders = {}

  const [globalRewardEpochs, accountRewardEpochs, vaults, lyraStaking, lyraBalances] = await Promise.all([
    Promise.all(Object.values(Network).map(network => getLyraSDK(network).globalRewardEpochs())),
    walletAddress
      ? Promise.all(Object.values(Network).map(network => getLyraSDK(network).accountRewardEpochs(walletAddress)))
      : [],
    fetchVaults(walletAddress ?? undefined),
    fetchLyraStaking(walletAddress),
    fetchLyraBalances(walletAddress),
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

    networkAccountRewardEpochs.map(epoch => {
      const epochReferredTraders = epoch?.accountEpoch?.tradingRewards?.newRewards?.referredTraders
      if (epochReferredTraders) {
        for (const trader in epochReferredTraders) {
          if (!referredTraders[trader]) {
            referredTraders[trader] = {
              trader: epochReferredTraders[trader].trader,
              trades: epochReferredTraders[trader].trades,
              fees: epochReferredTraders[trader].fees,
              premium: epochReferredTraders[trader].premium,
              volume: epochReferredTraders[trader].volume,
              tokens: epochReferredTraders[trader].tokens,
            }
          } else {
            referredTraders[trader].trades += epochReferredTraders[trader].trades
            referredTraders[trader].fees += epochReferredTraders[trader].fees
            referredTraders[trader].premium += epochReferredTraders[trader].premium
            referredTraders[trader].volume += epochReferredTraders[trader].volume
            epochReferredTraders[trader].tokens.forEach(newToken => {
              const existingToken = referredTraders[trader].tokens.find(
                token => token.address.toLowerCase() === newToken.address.toLowerCase()
              )
              if (!existingToken) {
                referredTraders[trader].tokens.push(newToken)
              } else {
                const existingTokenIndex = referredTraders[trader].tokens.findIndex(
                  token => token.address.toLowerCase() === newToken.address.toLowerCase()
                )
                referredTraders[trader].tokens[existingTokenIndex].amount += newToken.amount
              }
            })
          }
        }
      }
    })

    return {
      ...map,
      [network]: {
        globalRewardEpochs: networkGlobalEpochs,
        accountRewardEpochs: networkAccountRewardEpochs,
        latestRewardEpoch: {
          global: latestGlobalRewardEpoch,
          account: latestAccountRewardEpoch,
        },
        referredTraders: network === Network.Arbitrum ? referredTraders : undefined,
      },
    }
  }, {} as Record<Network, NetworkRewardsData>)

  return {
    epochs: networkEpochsMap,
    vaults,
    lyraBalances,
    lyraStaking,
    referredTraders,
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

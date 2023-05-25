import { AccountBalances, AccountRewardEpoch, GlobalRewardEpoch, Market, Network, Version } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import { Vault } from '@/app/constants/vault'
import fetchLyraBalances, { LyraBalances } from '@/app/utils/common/fetchLyraBalances'
import fetchVault from '@/app/utils/fetchVault'
import getLyraSDK from '@/app/utils/getLyraSDK'
import { lyraAvalon } from '@/app/utils/lyra'
import fetchLyraStaking, { LyraStaking } from '@/app/utils/rewards/fetchLyraStaking'

import useWallet from '../account/useWallet'
import useWalletAccount from '../account/useWalletAccount'
import useFetch, { useMutate } from '../data/useFetch'

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
}

const fetchEarnPageNetworkData = async (
  walletAddress?: string
): Promise<
  {
    network: Network
    vaults: Vault[]
    balances: AccountBalances[]
    lyraBalances: LyraBalances
    globalRewardEpochs: GlobalRewardEpoch[]
    accountRewardEpochs: AccountRewardEpoch[]
    latestGlobalRewardEpoch: GlobalRewardEpoch
    latestAccountRewardEpoch?: AccountRewardEpoch
  }[]
> => {
  return await Promise.all(
    Object.values(Network).map(async network => {
      const lyra = getLyraSDK(network)

      const fetchMarkets = async (): Promise<Market[]> =>
        network === Network.Optimism
          ? // TODO: @xuwu remove avalon version
            (await Promise.all([lyra.markets(), lyraAvalon.markets()])).flat()
          : await lyra.markets()

      const fetchBalances = async (): Promise<AccountBalances[]> =>
        walletAddress
          ? network === Network.Optimism
            ? // TODO: @xuwu remove avalon version
              (
                await Promise.all([
                  lyra.account(walletAddress).balances(),
                  lyraAvalon.account(walletAddress).balances(),
                ])
              ).flat()
            : await lyra.account(walletAddress).balances()
          : []

      const fetchAccountRewardEpochs = async (): Promise<AccountRewardEpoch[]> =>
        walletAddress ? lyra.accountRewardEpochs(walletAddress) : []

      const [lyraBalances, markets, balances, globalRewardEpochs, accountRewardEpochs] = await Promise.all([
        fetchLyraBalances(walletAddress),
        fetchMarkets(),
        fetchBalances(),
        lyra.globalRewardEpochs(),
        fetchAccountRewardEpochs(),
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

      const vaults = await Promise.all(
        markets.map(market =>
          // TODO: @xuwu remove avalon version
          market.lyra.version === Version.Avalon
            ? fetchVault(network, market, balances, lyraBalances, walletAddress)
            : fetchVault(
                network,
                market,
                balances,
                lyraBalances,
                walletAddress,
                latestGlobalRewardEpoch,
                latestAccountRewardEpoch
              )
        )
      )

      return {
        network,
        vaults,
        balances,
        lyraBalances,
        globalRewardEpochs,
        accountRewardEpochs,
        latestGlobalRewardEpoch,
        latestAccountRewardEpoch,
      }
    })
  )
}

export const fetchEarnPageData = async (walletAddress?: string): Promise<RewardsPageData> => {
  const [pageNetworkData, lyraStaking] = await Promise.all([
    fetchEarnPageNetworkData(walletAddress),
    fetchLyraStaking(walletAddress),
  ])

  const networkEpochsMap = pageNetworkData.reduce(
    (map, { network, globalRewardEpochs, accountRewardEpochs, latestGlobalRewardEpoch, latestAccountRewardEpoch }) => {
      return {
        ...map,
        [network]: {
          globalRewardEpochs,
          accountRewardEpochs,
          latestRewardEpoch: {
            global: latestGlobalRewardEpoch,
            account: latestAccountRewardEpoch,
          },
        },
      }
    },
    {} as Record<Network, NetworkRewardsData>
  )

  const vaults = pageNetworkData.flatMap(({ vaults }) => vaults)

  return {
    epochs: networkEpochsMap,
    vaults,
    lyraBalances: pageNetworkData[0].lyraBalances,
    lyraStaking,
  }
}

export default function useEarnPageData(): RewardsPageData | null {
  const account = useWalletAccount()
  const [rewardsPageData] = useFetch(FetchId.RewardsPageData, account ? [account] : [], fetchEarnPageData)
  return rewardsPageData
}

export function useMutateEarnPageData() {
  const { account } = useWallet()
  const mutate = useMutate(FetchId.RewardsPageData, fetchEarnPageData)
  return useCallback(() => (account ? mutate(account) : null), [mutate, account])
}

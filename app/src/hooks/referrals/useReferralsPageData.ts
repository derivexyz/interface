import { AccountRewardEpoch, GlobalRewardEpoch, Network, RewardEpochTokenAmount } from '@lyrafinance/lyra-js'
import { NewTradingRewardsReferredTraders } from '@lyrafinance/lyra-js/src/utils/fetchAccountRewardEpochData'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import getLyraSDK from '@/app/utils/getLyraSDK'
import fetchReferrerCode from '@/app/utils/referrals/fetchReferrerCode'

import useNetwork from '../account/useNetwork'
import useWallet from '../account/useWallet'
import useFetch, { useMutate } from '../data/useFetch'

export type ReferralsPageData = {
  latestGlobalRewardEpoch: GlobalRewardEpoch
  latestAccountRewardEpoch?: AccountRewardEpoch
  referrerCode: string | null | undefined
  currentEpochReferredTradersCount: number
  currentEpochReferredTradersVolume: number
  currentEpochReferredTradersRewards: RewardEpochTokenAmount[]
  allReferredTraders: NewTradingRewardsReferredTraders
}

export const fetchReferralsPageData = async (network: Network, walletAddress?: string): Promise<ReferralsPageData> => {
  const [globalRewardEpochs, accountRewardEpochs, referrerCode] = await Promise.all([
    getLyraSDK(network).globalRewardEpochs(),
    walletAddress ? getLyraSDK(network).accountRewardEpochs(walletAddress) : [],
    walletAddress ? fetchReferrerCode(walletAddress) : null,
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

  const currentEpochReferredTraders =
    latestAccountRewardEpoch?.accountEpoch?.tradingRewards?.newRewards?.referredTraders
  let currentEpochReferredTradersCount = 0
  let currentEpochReferredTradersVolume = 0
  const currentEpochReferredTradersRewards: RewardEpochTokenAmount[] = []
  if (currentEpochReferredTraders) {
    currentEpochReferredTradersCount = Object.keys(currentEpochReferredTraders).length
    currentEpochReferredTradersVolume = Object.values(currentEpochReferredTraders).reduce(
      (total, trader) => total + trader.volume,
      0
    )
    Object.values(currentEpochReferredTraders).forEach(trader => {
      if (trader.tokens) {
        trader.tokens.forEach(newToken => {
          const existingToken = currentEpochReferredTradersRewards.find(
            token => token.address.toLowerCase() === newToken.address.toLowerCase()
          )
          if (!existingToken) {
            currentEpochReferredTradersRewards.push(newToken)
          } else {
            const existingTokenIndex = currentEpochReferredTradersRewards.findIndex(
              token => token.address.toLowerCase() === newToken.address.toLowerCase()
            )
            currentEpochReferredTradersRewards[existingTokenIndex].amount += newToken.amount
          }
        })
      }
    })
  }

  const allReferredTraders: NewTradingRewardsReferredTraders = {}
  accountRewardEpochs.map(epoch => {
    const epochReferredTraders = epoch?.accountEpoch?.tradingRewards?.newRewards?.referredTraders
    if (epochReferredTraders) {
      for (const trader in epochReferredTraders) {
        if (!allReferredTraders[trader]) {
          allReferredTraders[trader] = {
            trader: epochReferredTraders[trader].trader,
            trades: epochReferredTraders[trader].trades,
            fees: epochReferredTraders[trader].fees,
            premium: epochReferredTraders[trader].premium,
            volume: epochReferredTraders[trader].volume,
            tokens: epochReferredTraders[trader].tokens,
          }
        } else {
          allReferredTraders[trader].trades += epochReferredTraders[trader].trades
          allReferredTraders[trader].fees += epochReferredTraders[trader].fees
          allReferredTraders[trader].premium += epochReferredTraders[trader].premium
          allReferredTraders[trader].volume += epochReferredTraders[trader].volume
          epochReferredTraders[trader].tokens.forEach(newToken => {
            const existingToken = allReferredTraders[trader].tokens.find(
              token => token.address.toLowerCase() === newToken.address.toLowerCase()
            )
            if (!existingToken) {
              allReferredTraders[trader].tokens.push(newToken)
            } else {
              const existingTokenIndex = allReferredTraders[trader].tokens.findIndex(
                token => token.address.toLowerCase() === newToken.address.toLowerCase()
              )
              allReferredTraders[trader].tokens[existingTokenIndex].amount += newToken.amount
            }
          })
        }
      }
    }
  })

  return {
    latestGlobalRewardEpoch: latestGlobalRewardEpoch,
    latestAccountRewardEpoch: latestAccountRewardEpoch,
    referrerCode: referrerCode,
    currentEpochReferredTradersCount,
    currentEpochReferredTradersVolume,
    currentEpochReferredTradersRewards,
    allReferredTraders,
  }
}

export default function useReferralsPageData(): ReferralsPageData | null {
  const { account } = useWallet()
  const network = useNetwork()
  const [referralsPageData] = useFetch(
    FetchId.ReferralsPageData,
    network ? [network, account] : null,
    fetchReferralsPageData
  )
  return referralsPageData
}

export function useMutateReferralsPageData() {
  const { account } = useWallet()
  const network = useNetwork()
  const mutate = useMutate(FetchId.ReferralsPageData, fetchReferralsPageData)
  return useCallback(() => (account ? mutate(network, account) : null), [account, mutate, network])
}

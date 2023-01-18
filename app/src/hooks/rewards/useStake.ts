import { BigNumber } from '@ethersproject/bignumber'
import { LyraStake } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { lyraOptimism } from '@/app/utils/lyra'

import useEthereumBlockFetch, { useEthereumBlockMutate } from '../data/useEthereumBlockFetch'
import useWalletAccount from '../wallet/useWalletAccount'

export const fetchStake = async (account: string, amount: BigNumber): Promise<LyraStake> => {
  return await lyraOptimism.stake(account, BigNumber.from(amount))
}

export default function useStake(amount: BigNumber): LyraStake | null {
  const account = useWalletAccount()
  const [stake] = useEthereumBlockFetch('Stake', account ? [account, amount] : null, fetchStake)
  return stake
}

export const useMutateStake = (amount: BigNumber): (() => Promise<LyraStake | null>) => {
  const mutate = useEthereumBlockMutate('Stake', fetchStake)
  const account = useWalletAccount()
  return useCallback(async () => {
    if (account) {
      return await mutate(account, amount)
    } else {
      return null
    }
  }, [mutate, account, amount])
}

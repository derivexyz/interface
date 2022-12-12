import { BigNumber } from '@ethersproject/bignumber'
import { LyraStake } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import lyra from '../../utils/lyra'
import useOptimismBlockFetch, { useOptimismBlockMutate } from '../data/useOptimismBlockFetch'
import useWalletAccount from '../wallet/useWalletAccount'

export const fetchStake = async (account: string, amount: BigNumber): Promise<LyraStake> => {
  return await lyra.stake(account, BigNumber.from(amount))
}

export default function useStake(amount: BigNumber): LyraStake | null {
  const account = useWalletAccount()
  const [stake] = useOptimismBlockFetch('Stake', account ? [account, amount] : null, fetchStake)
  return stake
}

export const useMutateStake = (amount: BigNumber): (() => Promise<LyraStake | null>) => {
  const mutate = useOptimismBlockMutate('Stake', fetchStake)
  const account = useWalletAccount()
  return useCallback(async () => {
    if (account) {
      return await mutate(account, amount)
    } else {
      return null
    }
  }, [mutate, account, amount])
}

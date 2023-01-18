import { BigNumber } from '@ethersproject/bignumber'
import { LyraUnstake } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { lyraOptimism } from '@/app/utils/lyra'

import useFetch, { useMutate } from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

export const fetchUnstake = async (account: string, amount: BigNumber): Promise<LyraUnstake> => {
  return await lyraOptimism.unstake(account, BigNumber.isBigNumber(amount) ? amount : BigNumber.from(amount))
}

export default function useUnstake(amount: BigNumber): LyraUnstake | null {
  const account = useWalletAccount()
  const [stake] = useFetch('Unstake', account ? [account, amount] : null, fetchUnstake)
  return stake
}

export const useMutateUnstake = (): (() => Promise<LyraUnstake | null>) => {
  const mutate = useMutate('Stake', fetchUnstake)
  const account = useWalletAccount()
  return useCallback(async () => {
    if (account) {
      return await mutate(account, ZERO_BN)
    } else {
      return null
    }
  }, [mutate, account])
}

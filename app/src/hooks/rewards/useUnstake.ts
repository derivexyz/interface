import { BigNumber } from '@ethersproject/bignumber'
import { LyraUnstake } from '@lyrafinance/lyra-js'

import { FetchId } from '@/app/constants/fetch'
import { lyraOptimism } from '@/app/utils/lyra'

import useWalletAccount from '../account/useWalletAccount'
import useFetch from '../data/useFetch'

export const fetchUnstake = async (account: string, amountStr: string): Promise<LyraUnstake> => {
  return await lyraOptimism.unstake(account, BigNumber.from(amountStr))
}

export default function useUnstake(amount: BigNumber): LyraUnstake | null {
  const account = useWalletAccount()
  const [stake] = useFetch(FetchId.Unstake, account ? [account, amount.toString()] : null, fetchUnstake)
  return stake
}

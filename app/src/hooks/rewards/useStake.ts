import { BigNumber } from '@ethersproject/bignumber'
import { LyraStake } from '@lyrafinance/lyra-js'

import { FetchId } from '@/app/constants/fetch'
import { lyraOptimism } from '@/app/utils/lyra'

import useWalletAccount from '../account/useWalletAccount'
import useFetch from '../data/useFetch'

export const fetchStake = async (account: string, amountStr: string): Promise<LyraStake> => {
  return await lyraOptimism.stake(account, BigNumber.from(amountStr))
}

export default function useStake(amount: BigNumber): LyraStake | null {
  const account = useWalletAccount()
  const [stake] = useFetch(FetchId.Stake, account ? [account, amount.toString()] : null, fetchStake)
  return stake
}

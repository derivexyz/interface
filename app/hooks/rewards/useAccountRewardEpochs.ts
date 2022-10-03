import { AccountRewardEpoch, Deployment } from '@lyrafinance/lyra-js'

import lyra from '../../utils/lyra'
import useFetch from '../data/useFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const EMPTY: AccountRewardEpoch[] = []

export const fetchAccountRewardEpochs = async (address: string): Promise<AccountRewardEpoch[]> =>
  lyra.deployment === Deployment.Mainnet ? await lyra.accountRewardEpochs(address) : []

export default function useAccountRewardEpochs(): AccountRewardEpoch[] {
  const account = useWalletAccount()
  const [data] = useFetch('AccountRewardEpochs', account ? [account] : null, fetchAccountRewardEpochs)
  return data ?? EMPTY
}

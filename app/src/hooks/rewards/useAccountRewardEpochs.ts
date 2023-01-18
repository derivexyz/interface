import { AccountRewardEpoch, Network } from '@lyrafinance/lyra-js'

import getLyraSDK from '../../utils/getLyraSDK'
import useFetch from '../data/useFetch'
import useNetwork from '../wallet/useNetwork'
import useWalletAccount from '../wallet/useWalletAccount'

const EMPTY: AccountRewardEpoch[] = []

export const fetchAccountRewardEpochs = async (address: string, network?: Network): Promise<AccountRewardEpoch[]> => {
  const networks = network ? [network] : [Network.Optimism, Network.Arbitrum]
  const accountRewardEpochs = await Promise.all(
    networks.map(async network => await getLyraSDK(network).accountRewardEpochs(address))
  )
  return accountRewardEpochs.flat()
}

export default function useAccountRewardEpochs(): AccountRewardEpoch[] {
  const account = useWalletAccount()
  const network = useNetwork()
  const [data] = useFetch('AccountRewardEpochs', account ? [account, network] : null, fetchAccountRewardEpochs)
  return data ?? EMPTY
}

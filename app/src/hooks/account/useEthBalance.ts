import { BigNumber } from '@ethersproject/bignumber'

import { FetchId } from '@/app/constants/fetch'
import { Network } from '@/app/constants/networks'
import getProvider from '@/app/utils/getProvider'

import { ZERO_BN } from '../../constants/bn'
import useFetch from '../data/useFetch'
import useWalletAccount from './useWalletAccount'

const fetcher = async (network: Network, account: string): Promise<BigNumber> => {
  return await getProvider(network).getBalance(account)
}

export default function useEthBalance(network: Network): BigNumber {
  const account = useWalletAccount()
  const [balance] = useFetch(FetchId.AccountEthBalance, account ? [network, account] : null, fetcher)
  return balance ?? ZERO_BN
}

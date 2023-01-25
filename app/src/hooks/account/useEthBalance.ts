import { BigNumber } from '@ethersproject/bignumber'
import { Network } from '@lyrafinance/lyra-js'

import { FetchId } from '@/app/constants/fetch'
import getLyraSDK from '@/app/utils/getLyraSDK'

import { ZERO_BN } from '../../constants/bn'
import useFetch from '../data/useFetch'
import useWalletAccount from './useWalletAccount'

const fetcher = async (network: Network, account: string): Promise<BigNumber> => {
  return await getLyraSDK(network).provider.getBalance(account)
}

export default function useEthBalance(network: Network): BigNumber {
  const account = useWalletAccount()
  const [balance] = useFetch(FetchId.AccountEthBalance, account ? [network, account] : null, fetcher)
  return balance ?? ZERO_BN
}

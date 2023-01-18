import { BigNumber } from '@ethersproject/bignumber'
import { Network } from '@lyrafinance/lyra-js'

import getLyraSDK from '@/app/utils/getLyraSDK'

import { ZERO_BN } from '../../constants/bn'
import useBlockFetch from '../data/useBlockFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const fetcher = async (network: Network, account: string): Promise<BigNumber> => {
  return await getLyraSDK(network).provider.getBalance(account)
}

export default function useEthBalance(network: Network): BigNumber {
  const account = useWalletAccount()
  const [balance] = useBlockFetch(network, 'EthBalance', account ? [network, account] : null, fetcher)
  return balance ?? ZERO_BN
}

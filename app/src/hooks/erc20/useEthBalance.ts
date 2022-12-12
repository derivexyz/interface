import { BigNumber } from '@ethersproject/bignumber'
import { Network } from '@lyrafinance/lyra-js'

import lyra from '@/app/utils/lyra'

import { ZERO_BN } from '../../constants/bn'
import useBlockFetch from '../data/useBlockFetch'
import useWalletAccount from '../wallet/useWalletAccount'

const fetcher = async (account: string): Promise<BigNumber> => {
  return await lyra.provider.getBalance(account)
}

export default function useEthBalance(network: Network): BigNumber {
  const account = useWalletAccount()
  const [balance] = useBlockFetch(network, 'EthBalance', account ? [account] : null, fetcher)
  return balance ?? ZERO_BN
}

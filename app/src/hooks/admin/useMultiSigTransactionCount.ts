import { BigNumber } from '@ethersproject/bignumber'
import { Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import getIsOwnerMultiSig from '@/app/utils/getIsOwnerMultiSig'
import getMultiSigWalletContract from '@/app/utils/getMultiSigWalletContract'

import useFetch, { useMutate } from '../data/useFetch'

const fetcher = async (network: Network, owner: string) => {
  const isOwnerMultiSig = await getIsOwnerMultiSig(network, owner)
  if (!isOwnerMultiSig) {
    return null
  }
  const multiSigWallet = getMultiSigWalletContract(network, owner)
  return await multiSigWallet.getTransactionCount(true, true)
}

export default function useMultiSigTransactionCount(network: Network, owner: string | null): BigNumber | null {
  const [transactionCount] = useFetch(FetchId.AdminMultiSigTransactionCount, owner ? [network, owner] : null, fetcher)
  return transactionCount
}

export function useMutateMultiSigTransactionCount(network: Network, owner: string | null) {
  const mutate = useMutate(FetchId.AdminMultiSigTransactionCount, fetcher)
  return useCallback(async () => (owner ? await mutate(network, owner) : null), [mutate, network, owner])
}

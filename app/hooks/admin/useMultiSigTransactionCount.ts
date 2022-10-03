import { BigNumber } from '@ethersproject/bignumber'
import { useCallback } from 'react'

import { Network } from '@/app/constants/networks'
import getIsOwnerMultiSig from '@/app/utils/getIsOwnerMultiSig'
import getMultiSigWalletContract from '@/app/utils/getMultiSigWalletContract'

import useBlockFetch from '../data/useBlockFetch'
import { useMutate } from '../data/useFetch'

const fetcher = async (owner: string) => {
  const isOwnerMultiSig = await getIsOwnerMultiSig(owner)
  if (!isOwnerMultiSig) {
    return null
  }
  const multiSigWallet = getMultiSigWalletContract(owner)
  return await multiSigWallet.getTransactionCount(true, true)
}

export default function useMultiSigTransactionCount(owner: string | null): BigNumber | null {
  const [transactionCount] = useBlockFetch(
    Network.Optimism,
    'MultiSigTransactionCount',
    owner ? [owner] : null,
    fetcher
  )
  return transactionCount
}

export function useMutateMultiSigTransactionCount(owner: string | null): () => Promise<BigNumber | null> {
  const mutate = useMutate('MultiSigTransactionCount', fetcher)
  return useCallback(async () => (owner ? await mutate(owner) : null), [mutate, owner])
}

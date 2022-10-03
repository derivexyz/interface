import { BigNumber } from '@ethersproject/bignumber'
import { useCallback } from 'react'

import { Network } from '@/app/constants/networks'
import getIsOwnerMultiSig from '@/app/utils/getIsOwnerMultiSig'
import getMultiSigWalletContract from '@/app/utils/getMultiSigWalletContract'

import useBlockFetch from '../data/useBlockFetch'
import { useMutate } from '../data/useFetch'

const fetcher = async (owner: string, from: BigNumber, to: BigNumber) => {
  const isOwnerMultiSig = await getIsOwnerMultiSig(owner)
  if (!isOwnerMultiSig) {
    return null
  }
  const multiSigWallet = getMultiSigWalletContract(owner)
  const transactionIds = await multiSigWallet.getTransactionIds(from, to, true, true)
  return transactionIds.slice().sort((a, b) => b.toNumber() - a.toNumber())
}

export default function useMultiSigTransactionIds(
  owner: string | null,
  from: BigNumber,
  to: BigNumber
): BigNumber[] | null {
  const [transactionIds] = useBlockFetch(
    Network.Optimism,
    'MultiSigTransactionIds',
    owner ? [owner, from, to] : null,
    fetcher
  )
  return transactionIds
}

export function useMutateMultiSigTransactionIds(
  owner: string | null,
  from: BigNumber,
  to: BigNumber
): () => Promise<BigNumber[] | null> {
  const mutate = useMutate('MultiSigTransactionIds', fetcher)
  return useCallback(async () => (owner ? await mutate(owner, from, to) : null), [mutate, from, to, owner])
}

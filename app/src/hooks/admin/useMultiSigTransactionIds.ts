import { BigNumber } from '@ethersproject/bignumber'
import { Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import getIsOwnerMultiSig from '@/app/utils/getIsOwnerMultiSig'
import getMultiSigWalletContract from '@/app/utils/getMultiSigWalletContract'

import useBlockFetch from '../data/useBlockFetch'
import { useMutate } from '../data/useFetch'

const fetcher = async (network: Network, owner: string, from: BigNumber, to: BigNumber) => {
  const isOwnerMultiSig = await getIsOwnerMultiSig(network, owner)
  if (!isOwnerMultiSig) {
    return null
  }
  const multiSigWallet = getMultiSigWalletContract(network, owner)
  const transactionIds = await multiSigWallet.getTransactionIds(from, to, true, true)
  return transactionIds.slice().sort((a, b) => b.toNumber() - a.toNumber())
}

export default function useMultiSigTransactionIds(
  network: Network,
  owner: string | null,
  from: BigNumber,
  to: BigNumber
): BigNumber[] | null {
  const [transactionIds] = useBlockFetch(
    network,
    'MultiSigTransactionIds',
    owner ? [network, owner, from, to] : null,
    fetcher
  )
  return transactionIds
}

export function useMutateMultiSigTransactionIds(
  network: Network,
  owner: string | null,
  from: BigNumber,
  to: BigNumber
): () => Promise<BigNumber[] | null> {
  const mutate = useMutate('MultiSigTransactionIds', fetcher)
  return useCallback(async () => (owner ? await mutate(network, owner, from, to) : null), [mutate, from, to, owner])
}

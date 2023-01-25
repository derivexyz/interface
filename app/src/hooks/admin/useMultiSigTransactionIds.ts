import { BigNumber } from '@ethersproject/bignumber'
import { Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { FetchId } from '@/app/constants/fetch'
import getIsOwnerMultiSig from '@/app/utils/getIsOwnerMultiSig'
import getMultiSigWalletContract from '@/app/utils/getMultiSigWalletContract'

import useFetch, { useMutate } from '../data/useFetch'

const fetcher = async (network: Network, owner: string, from: number, to: number) => {
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
  const [transactionIds] = useFetch(
    FetchId.AdminMultiSigTransactionIds,
    owner ? [network, owner, from.toNumber(), to.toNumber()] : null,
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
  const mutate = useMutate(FetchId.AdminMultiSigTransactionIds, fetcher)
  return useCallback(
    async () => (owner ? await mutate(network, owner, from.toNumber(), to.toNumber()) : null),
    [owner, mutate, network, from, to]
  )
}

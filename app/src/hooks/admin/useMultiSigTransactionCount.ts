import { BigNumber } from '@ethersproject/bignumber'
import { Network } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import getIsOwnerMultiSig from '@/app/utils/getIsOwnerMultiSig'
import getMultiSigWalletContract from '@/app/utils/getMultiSigWalletContract'

import useBlockFetch from '../data/useBlockFetch'
import { useMutate } from '../data/useFetch'

const fetcher = async (network: Network, owner: string) => {
  const isOwnerMultiSig = await getIsOwnerMultiSig(network, owner)
  if (!isOwnerMultiSig) {
    return null
  }
  const multiSigWallet = getMultiSigWalletContract(network, owner)
  return await multiSigWallet.getTransactionCount(true, true)
}

// TODO @michaelxuwu add Network support
export default function useMultiSigTransactionCount(network: Network, owner: string | null): BigNumber | null {
  const [transactionCount] = useBlockFetch(
    Network.Optimism,
    'MultiSigTransactionCount',
    owner ? [network, owner] : null,
    fetcher
  )
  return transactionCount
}

export function useMutateMultiSigTransactionCount(
  network: Network,
  owner: string | null
): () => Promise<BigNumber | null> {
  const mutate = useMutate('MultiSigTransactionCount', fetcher)
  return useCallback(async () => (owner ? await mutate(network, owner) : null), [mutate, owner])
}

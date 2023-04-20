import { Contract } from '@ethersproject/contracts'
import { useCallback } from 'react'

import { ContractId } from '@/app/constants/contracts'
import { FetchId } from '@/app/constants/fetch'
import { AppNetwork } from '@/app/constants/networks'
import { VestingEscrow } from '@/app/contracts/typechain'
import getContract from '@/app/utils/common/getContract'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getProvider from '@/app/utils/getProvider'

import VESTING_ESCROW_ABI from '../../contracts/abis/VestingEscrow.json'
import useWalletAccount from '../account/useWalletAccount'
import useFetch from '../data/useFetch'
import { useMutate } from '../data/useFetch'

export type EscrowEventData = {
  vestingBegin: number
  vestingEnd: number
  vestingCliff: number
  amount: number
  escrowProxy: string
  claimableBalance: number
}

async function fetcher(address: string): Promise<EscrowEventData[]> {
  const vestingEscrowFactory1 = getContract(ContractId.VestingEscrowFactory1, AppNetwork.Ethereum)
  const vestingEscrowFactory2 = getContract(ContractId.VestingEscrowFactory2, AppNetwork.Ethereum)

  const vestingEscrowCreatedFilter = vestingEscrowFactory1.filters.VestingEscrowCreated(
    null,
    null,
    address,
    null,
    null,
    null,
    null,
    null,
    null
  )

  const factory1Events = await vestingEscrowFactory1.queryFilter(vestingEscrowCreatedFilter)
  const factory2Events = await vestingEscrowFactory2.queryFilter(vestingEscrowCreatedFilter)
  const events = factory1Events.concat(factory2Events)

  events.sort((a, b) => a.blockNumber - b.blockNumber)
  const claimableBalances = await Promise.all(
    events.map(async event => {
      const escrowContract = new Contract(
        event.args.escrow,
        VESTING_ESCROW_ABI,
        getProvider(AppNetwork.Ethereum)
      ) as VestingEscrow
      return await escrowContract.getClaimable()
    })
  )
  return events.map((event, i) => ({
    vestingBegin: event.args.vestingBegin.toNumber(),
    vestingEnd: event.args.vestingEnd.toNumber(),
    vestingCliff: event.args.vestingCliff.toNumber(),
    amount: fromBigNumber(event.args.amount),
    escrowProxy: event.args.escrow,
    claimableBalance: fromBigNumber(claimableBalances[i]),
  }))
}

export default function useEscrowPageData(): EscrowEventData[] | null {
  const account = useWalletAccount()
  const [data] = useFetch(FetchId.EscrowPageData, account ? [account] : null, fetcher)
  return data
}

export function useMutateEscrowPageData(
  escrowEventData: EscrowEventData[] | null
): () => Promise<EscrowEventData[] | null> {
  const account = useWalletAccount()
  const mutate = useMutate(FetchId.EscrowPageData, fetcher)
  return useCallback(
    async () => (escrowEventData ? await mutate(account ?? '') : null),
    [account, escrowEventData, mutate]
  )
}

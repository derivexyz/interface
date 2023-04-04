import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import { ContractId } from '@/app/constants/contracts'
import { Vote } from '@/app/constants/governance'
import { AppNetwork } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { useMutateVoteDetailsPageData } from '@/app/hooks/vote/useVoteDetailsPageData'
import getContract from '@/app/utils/common/getContract'
import { submitVote } from '@/app/utils/vote/submitVote'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  proposalId: number
  vote: Vote | null
  onVote?: () => void
} & MarginProps

const VoteFormButton = ({ vote, proposalId, onVote, ...marginProps }: Props) => {
  const account = useWalletAccount()
  const execute = useTransaction(AppNetwork.Ethereum)
  const mutateVoteDetailsPageData = useMutateVoteDetailsPageData(String(proposalId))
  const handleVote = async () => {
    if (!account || !vote) {
      return
    }
    const tx = await submitVote(account, proposalId, vote)
    const lyraGovernanceV2Contract = getContract(ContractId.LyraGovernanceV2, AppNetwork.Ethereum)
    await execute({ tx, contract: lyraGovernanceV2Contract }, TransactionType.VoteProposal, {
      onComplete: async () => {
        await mutateVoteDetailsPageData()
        if (onVote) {
          onVote()
        }
      },
    })
  }

  return (
    <TransactionButton
      transactionType={TransactionType.VoteProposal}
      network={AppNetwork.Ethereum}
      label="Submit Vote"
      isDisabled={vote === null}
      onClick={async () => await handleVote()}
      {...marginProps}
    />
  )
}

export default VoteFormButton

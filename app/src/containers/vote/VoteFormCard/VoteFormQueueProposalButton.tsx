import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import { ContractId } from '@/app/constants/contracts'
import { AppNetwork } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { useMutateVoteDetailsPageData } from '@/app/hooks/vote/useVoteDetailsPageData'
import getContract from '@/app/utils/common/getContract'
import { queueProposal } from '@/app/utils/vote/queueProposal'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  proposalId: number
  onQueue?: () => void
} & MarginProps

const VoteFormQueueProposalButton = ({ proposalId, onQueue, ...marginProps }: Props) => {
  const account = useWalletAccount()
  const execute = useTransaction(AppNetwork.Ethereum)
  const mutateVoteDetailsPageData = useMutateVoteDetailsPageData(String(proposalId))
  const handleVote = async () => {
    if (!account) {
      return
    }
    const tx = await queueProposal(account, proposalId)
    const lyraGovernanceV2Contract = getContract(ContractId.LyraGovernanceV2, AppNetwork.Ethereum)
    await execute({ tx, contract: lyraGovernanceV2Contract }, TransactionType.VoteProposal, {
      onComplete: async () => {
        await mutateVoteDetailsPageData()
        if (onQueue) {
          onQueue()
        }
      },
    })
  }

  return (
    <TransactionButton
      transactionType={TransactionType.QueueProposal}
      network={AppNetwork.Ethereum}
      label="Queue Proposal"
      onClick={async () => await handleVote()}
      {...marginProps}
    />
  )
}

export default VoteFormQueueProposalButton

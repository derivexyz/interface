import { BigNumber } from '@ethersproject/bignumber'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import React from 'react'
import { useCallback } from 'react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { ContractId } from '@/app/constants/contracts'
import { ProposalAction } from '@/app/constants/governance'
import { AppNetwork } from '@/app/constants/networks'
import { PageId } from '@/app/constants/pages'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import withSuspense from '@/app/hooks/data/withSuspense'
import useCreateProposalData from '@/app/hooks/vote/useCreateProposalData'
import { useMutateVoteIndexPageData } from '@/app/hooks/vote/useVoteIndexPageData'
import getContract from '@/app/utils/common/getContract'
import getPagePath from '@/app/utils/getPagePath'
import createProposal from '@/app/utils/vote/createProposal'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  executor: string
  target: string
  ethAmount: BigNumber
  tokenAddress: string
  tokenAmount: BigNumber
  proposalNetwork: AppNetwork
  action: ProposalAction
  calldata: string
  title: string
  summary: string
  motivation: string
  specification: string
  references: string
  onCreate?: () => void
}

const validateForm = (
  executor: string,
  title: string,
  summary: string,
  motivation: string,
  specification: string
): boolean => {
  return (
    executor.trim() !== '' &&
    title.trim() !== '' &&
    summary.trim() !== '' &&
    motivation.trim() !== '' &&
    specification.trim() !== ''
  )
}

const VoteCreateProposalFormButton = withSuspense(
  ({
    executor,
    action,
    target,
    ethAmount,
    tokenAddress,
    tokenAmount,
    calldata,
    proposalNetwork,
    title,
    summary,
    motivation,
    specification,
    references,
    onCreate,
  }: Props) => {
    const account = useWalletAccount()
    const isLongExecutor = [ProposalAction.MetaGovernance, ProposalAction.Custom].includes(action)
    const { shortExecutor, longExecutor, governance } = useCreateProposalData()
    const minimumPropositionPower = isLongExecutor
      ? longExecutor.minimumPropositionPower
      : shortExecutor.minimumPropositionPower
    const { votingPower } = governance
    const mutateIndexPageData = useMutateVoteIndexPageData()
    const execute = useTransaction(AppNetwork.Ethereum)
    const navigate = useNavigate()
    const { isFormValid, hasPropositionPower } = useMemo(() => {
      const isFormValid = validateForm(executor, title, summary, motivation, specification)
      const hasPropositionPower = votingPower >= minimumPropositionPower
      return {
        isFormValid,
        hasPropositionPower,
      }
    }, [executor, minimumPropositionPower, motivation, specification, summary, title, votingPower])
    const handleCreateProposal = useCallback(async () => {
      if (!account) {
        return
      }
      const tx = await createProposal(
        account,
        executor,
        target,
        ethAmount,
        tokenAddress,
        tokenAmount,
        calldata,
        proposalNetwork,
        title,
        summary,
        motivation,
        specification,
        references
      )

      const lyraGovernanceV2Contract = getContract(ContractId.LyraGovernanceV2, AppNetwork.Ethereum)

      await execute({ tx, contract: lyraGovernanceV2Contract }, TransactionType.CreateProposal, {
        onComplete: async () => {
          await mutateIndexPageData()
          if (onCreate) {
            onCreate()
          }
          navigate(getPagePath({ page: PageId.VoteIndex }))
        },
      })
    }, [
      account,
      calldata,
      ethAmount,
      execute,
      executor,
      motivation,
      mutateIndexPageData,
      navigate,
      onCreate,
      proposalNetwork,
      references,
      specification,
      summary,
      target,
      title,
      tokenAddress,
      tokenAmount,
    ])

    return (
      <TransactionButton
        transactionType={TransactionType.CreateProposal}
        network={AppNetwork.Ethereum}
        label={!hasPropositionPower ? 'Insufficent Proposition Power' : 'Create Proposal'}
        isDisabled={!isFormValid || !hasPropositionPower}
        onClick={async () => await handleCreateProposal()}
      />
    )
  },
  () => <ButtonShimmer size="lg" width="100%" />
)

export default VoteCreateProposalFormButton

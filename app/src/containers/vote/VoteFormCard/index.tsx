import { BigNumber } from '@ethersproject/bignumber'
import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useMemo } from 'react'

import { ProposalState, Vote } from '@/app/constants/governance'
import useWallet from '@/app/hooks/account/useWallet'
import { VoteDetailsPageData } from '@/app/hooks/vote/useVoteDetailsPageData'
import fromBigNumber from '@/app/utils/fromBigNumber'

import VoteFormButton from './VoteFormButton'
import VoteFormExecuteProposalButton from './VoteFormExecuteProposalButton'
import VoteFormQueueProposalButton from './VoteFormQueueProposalButton'

type Props = {
  data: VoteDetailsPageData
} & MarginProps

const VoteFormCard = ({ data, ...marginProps }: Props) => {
  const { account } = useWallet()
  const currentTimestamp = data.blockTimestamp
  const userVote = useMemo(
    () => data.votes.find(vote => vote.user.id.toLowerCase() === account?.toLowerCase()),
    [data, account]
  )
  const support = userVote ? (userVote.support ? Vote.For : Vote.Against) : null
  const [vote, setVote] = useState<Vote | null>(support)
  useEffect(() => {
    const userVote = data.votes.find(vote => vote.user.id.toLowerCase() === account?.toLowerCase())
    if (userVote) {
      setVote(userVote.support ? Vote.For : Vote.Against)
    }
  }, [data, account])
  const proposalState = data.proposal.proposalState
  const votingPower = data.strategy.votingPower
  const voteAmount = userVote ? fromBigNumber(BigNumber.from(userVote.votingPower)) : 0
  const showSupportButtons = account && support === null && votingPower > 0 && proposalState === ProposalState.Active
  const showVoteButton = support === null && proposalState === ProposalState.Active
  const showQueueProposalButton = account && proposalState === ProposalState.Succeeded
  const executionTimestamp = data.proposal.executionTime ? parseInt(data.proposal.executionTime) : null
  const gracePeriodTimestamp = executionTimestamp ? executionTimestamp + data.executor.gracePeriod : 0
  const isGracePeriodOver = gracePeriodTimestamp < currentTimestamp
  const showExecuteProposalButton = account && !isGracePeriodOver && proposalState === ProposalState.Queued

  return (
    <Card {...marginProps}>
      <CardBody>
        <Text variant="cardHeading" mb={4}>
          Your voting info
        </Text>
        <Flex flexDirection="row" justifyContent="space-between" my={2}>
          <Flex flexDirection="column">
            <Text color="secondaryText">Voting Power</Text>
            <Text variant="small" color="secondaryText">
              stkLYRA
            </Text>
          </Flex>
          <Text color="text">{formatNumber(votingPower)} stkLYRA</Text>
        </Flex>
        {support && voteAmount > 0 ? (
          <Flex flexDirection="row" justifyContent="space-between" my={2}>
            <Text color="secondaryText">Your vote</Text>
            <Text color={support === Vote.For ? 'primaryText' : 'errorText'}>
              {support.toUpperCase()} {formatNumber(voteAmount)}
            </Text>
          </Flex>
        ) : null}
        {showSupportButtons ? (
          <>
            <Button
              label="For"
              size="lg"
              my={4}
              rightIcon={vote === Vote.For ? IconType.Check : null}
              sx={{
                bg: vote === Vote.For ? 'active' : undefined,
                borderColor: vote === Vote.For ? 'primaryButtonBg' : 'cardOutline',
              }}
              onClick={() => {
                if (vote === Vote.For) {
                  setVote(null)
                } else {
                  setVote(Vote.For)
                }
              }}
            />
            <Button
              label="Against"
              size="lg"
              rightIcon={vote === Vote.Against ? IconType.Check : null}
              sx={{
                bg: vote === Vote.Against ? 'active' : undefined,
                borderColor: vote === Vote.Against ? 'errorButtonBg' : 'cardOutline',
              }}
              onClick={() => {
                if (vote === Vote.Against) {
                  setVote(null)
                } else {
                  setVote(Vote.Against)
                }
              }}
            />
          </>
        ) : null}
        {showVoteButton ? <VoteFormButton mt={4} vote={vote} proposalId={parseInt(data.proposal.id)} /> : null}
        {showQueueProposalButton ? (
          <VoteFormQueueProposalButton mt={4} proposalId={parseInt(data.proposal.id)} />
        ) : null}
        {showExecuteProposalButton ? (
          <VoteFormExecuteProposalButton mt={4} proposalId={parseInt(data.proposal.id)} />
        ) : null}
      </CardBody>
    </Card>
  )
}

export default VoteFormCard

import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import Token from '@lyra/ui/components/Token'
import { MarginProps } from '@lyra/ui/types'
import formatDate from '@lyra/ui/utils/formatDate'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Proposal } from '@/app/constants/governance'
import { PageId } from '@/app/constants/pages'
import getPagePath from '@/app/utils/getPagePath'
import getProposalStateVariant from '@/app/utils/vote/getProposalStateVariant'

type Props = {
  proposal: Proposal
} & MarginProps

const VoteProposalCard = ({ proposal }: Props) => {
  const navigate = useNavigate()
  const title = proposal.title
  const proposedTimestamp = proposal.timestamp
  const proposalState = proposal.proposalState
  return (
    <Card
      mb={4}
      onClick={() =>
        navigate(
          getPagePath({
            page: PageId.VoteProposalDetails,
            proposalId: parseInt(proposal.id),
          })
        )
      }
      sx={{
        ':hover': {
          bg: 'cardHoverBg',
          cursor: 'pointer',
        },
        ':active': {
          bg: 'active',
          cursor: 'pointer',
        },
      }}
    >
      <CardBody>
        <Flex alignItems="center">
          <Flex mr={2} alignItems="center">
            <Text width={125} color="secondaryText">
              {formatDate(proposedTimestamp, false)}
            </Text>
            <Text>{title}</Text>
          </Flex>
          <Token
            minWidth={100}
            ml="auto"
            label={proposalState.toUpperCase()}
            variant={getProposalStateVariant(proposalState)}
          />
        </Flex>
      </CardBody>
    </Card>
  )
}

export default VoteProposalCard

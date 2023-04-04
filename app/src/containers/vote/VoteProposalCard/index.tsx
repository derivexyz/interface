import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import Token from '@lyra/ui/components/Token'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatDate from '@lyra/ui/utils/formatDate'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { Proposal } from '@/app/constants/governance'
import { VOTE_PROPOSALS_CARD_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import getPagePath from '@/app/utils/getPagePath'
import getProposalStateVariant from '@/app/utils/vote/getProposalStateVariant'

type Props = {
  proposal: Proposal
} & MarginProps

const VoteProposalCard = ({ proposal }: Props) => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
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
          bg: 'cardNestedHover',
          cursor: 'pointer',
        },
        ':active': {
          bg: 'active',
          cursor: 'pointer',
        },
      }}
    >
      <CardBody>
        <Grid
          width="100%"
          sx={{
            gridTemplateColumns: VOTE_PROPOSALS_CARD_GRID_COLUMN_TEMPLATE,
            gridColumnGap: 4,
            gridRowGap: 6,
            alignItems: 'center',
          }}
        >
          <Text variant={isMobile ? 'body' : 'bodyLarge'} color="secondaryText">
            {formatDate(proposedTimestamp, false)}
          </Text>
          <Text variant={isMobile ? 'body' : 'bodyLarge'} sx={{ fontWeight: 400 }}>
            {title}
          </Text>
          <Token
            label={proposalState.toUpperCase()}
            variant={getProposalStateVariant(proposalState)}
            sx={{
              height: '100%',
              padding: 2,
              fontSize: 16,
              fontFamily: 'body',
              fontWeight: 'medium',
              lineHeight: 'body',
              letterSpacing: 'body',
            }}
          />
        </Grid>
      </CardBody>
    </Card>
  )
}

export default VoteProposalCard

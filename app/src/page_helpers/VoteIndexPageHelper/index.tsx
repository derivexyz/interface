import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { GOVERNANCE_DOC_URL } from '@/app/constants/links'
import { LogEvent } from '@/app/constants/logEvents'
import { PageId } from '@/app/constants/pages'
import TotalSupplyHeaderCard from '@/app/containers/common/TotalSupplyHeaderCard'
import VoteProposalCard from '@/app/containers/vote/VoteProposalCard'
import { VoteIndexPageData } from '@/app/hooks/vote/useVoteIndexPageData'
import getPagePath from '@/app/utils/getPagePath'
import logEvent from '@/app/utils/logEvent'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  data: VoteIndexPageData
}

const VoteIndexPageHelper = ({ data }: Props) => {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  return (
    <Page title="Vote" subtitle="View and create proposals" headerCard={<TotalSupplyHeaderCard />}>
      <PageGrid>
        <Text variant="heading">Proposals</Text>
        <Grid sx={{ gridTemplateColumns: ['1fr', '4fr 1fr'], gridColumnGap: [3, 6], gridRowGap: [3, 6] }}>
          <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems="center">
            <Text color="secondaryText">
              Staked LYRA tokens represent voting rights in Lyra governance. You can vote on each proposal yourself or
              delegate your votes to a third party.{' '}
              <Link
                mt="auto"
                href={GOVERNANCE_DOC_URL}
                showRightIcon
                onClick={() => logEvent(LogEvent.VoteGovernanceClick)}
                target="_blank"
                color="secondaryText"
              >
                Learn more
              </Link>
            </Text>
          </Flex>
          {!isMobile ? (
            <Button
              label="Create Proposal"
              variant="primary"
              size="lg"
              width="100%"
              onClick={() => navigate(getPagePath({ page: PageId.VoteProposalCreate }))}
            />
          ) : null}
        </Grid>
        <Flex flexDirection="column">
          {data.proposals.map(proposal => {
            return <VoteProposalCard key={proposal.id} proposal={proposal} />
          })}
        </Flex>
      </PageGrid>
    </Page>
  )
}

export default VoteIndexPageHelper

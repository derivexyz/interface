import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { GOVERNANCE_DOC_URL } from '@/app/constants/links'
import { LogEvent } from '@/app/constants/logEvents'
import { PageId } from '@/app/constants/pages'
import VoteProposalCard from '@/app/containers/vote/VoteProposalCard'
import VotePageHeader from '@/app/containers/vote_index/VotePageHeader'
import { VoteIndexPageData } from '@/app/hooks/vote/useVoteIndexPageData'
import getPagePath from '@/app/utils/getPagePath'
import logEvent from '@/app/utils/logEvent'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  data: VoteIndexPageData
} & MarginProps

const VoteIndexPageHelper = ({ data, ...marginProps }: Props) => {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  return (
    <Page noHeaderPadding header={!isMobile ? <VotePageHeader /> : null} {...marginProps}>
      <PageGrid>
        {isMobile ? <VotePageHeader /> : null}
        <Box px={[6, 0]}>
          <Text variant="heading">Proposals</Text>
          <Flex flexDirection={isMobile ? 'column' : 'row'} alignItems="center">
            <Text variant="secondary" color="secondaryText">
              Staked LYRA tokens represent voting rights in Lyra governance. You can vote on each proposal yourself or
              delegate your votes to a third party.{' '}
              <Link
                textVariant="secondary"
                mt="auto"
                href={GOVERNANCE_DOC_URL}
                showRightIcon
                onClick={() => logEvent(LogEvent.VoteGovernanceClick)}
                target="_blank"
              >
                Learn more
              </Link>
            </Text>
            {!isMobile ? (
              <Button
                label="Create Proposal"
                variant="primary"
                size="lg"
                width={250}
                onClick={() => navigate(getPagePath({ page: PageId.VoteProposalCreate }))}
              />
            ) : null}
          </Flex>
          {isMobile ? (
            <Button
              label="Create Proposal"
              variant="primary"
              size="md"
              mt={6}
              onClick={() => navigate(getPagePath({ page: PageId.VoteProposalCreate }))}
            />
          ) : null}
        </Box>
        <Flex flexDirection="column" mt={4}>
          {data.proposals.map(proposal => {
            return <VoteProposalCard key={proposal.id} proposal={proposal} />
          })}
        </Flex>
      </PageGrid>
    </Page>
  )
}

export default VoteIndexPageHelper

import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import VoteDetailsCard from '@/app/containers/vote/VoteDetailsCard'
import VoteFormCard from '@/app/containers/vote/VoteFormCard'
import VoteResultsCard from '@/app/containers/vote/VoteResultsCard'
import VotePageHeader from '@/app/containers/vote_index/VotePageHeader'
import { VoteDetailsPageData } from '@/app/hooks/vote/useVoteDetailsPageData'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  data: VoteDetailsPageData
} & MarginProps

const VoteProposalDetailsPageHelper = ({ data }: Props) => {
  const isMobile = useIsMobile()
  return (
    <Page noHeaderPadding header={!isMobile ? <VotePageHeader showBackButton /> : null}>
      <PageGrid>
        {isMobile ? <VotePageHeader showBackButton /> : null}
        <Box px={[6, 0]}>
          <Text variant="heading">Proposal Overview</Text>
        </Box>
        <Grid width="100%" sx={{ gridTemplateColumns: ['1fr', '2fr 1fr'], gridColumnGap: [3, 6], gridRowGap: [3, 6] }}>
          <VoteDetailsCard data={data} />
          <Flex flexDirection="column">
            <VoteFormCard data={data} mb={4} />
            <VoteResultsCard data={data} />
          </Flex>
        </Grid>
      </PageGrid>
    </Page>
  )
}

export default VoteProposalDetailsPageHelper

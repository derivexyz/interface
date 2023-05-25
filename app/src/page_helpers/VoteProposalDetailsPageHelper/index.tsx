import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import { PageId } from '@/app/constants/pages'
import TotalSupplyHeaderCard from '@/app/containers/common/TotalSupplyHeaderCard'
import VoteDetailsCard from '@/app/containers/vote/VoteDetailsCard'
import VoteFormCard from '@/app/containers/vote/VoteFormCard'
import VoteResultsCard from '@/app/containers/vote/VoteResultsCard'
import { VoteDetailsPageData } from '@/app/hooks/vote/useVoteDetailsPageData'
import getPagePath from '@/app/utils/getPagePath'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  data: VoteDetailsPageData
}

const VoteProposalDetailsPageHelper = ({ data }: Props) => {
  return (
    <Page
      title="Vote"
      showBackButton
      backHref={getPagePath({ page: PageId.VoteIndex })}
      subtitle="View and create proposals"
      headerCard={<TotalSupplyHeaderCard />}
    >
      <PageGrid>
        <Text variant="heading">{data.proposal.title}</Text>
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

import Box from '@lyra/ui/components/Box'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import TotalSupplyHeaderCard from '@/app/containers/common/TotalSupplyHeaderCard'
import VoteCreateProposalFormCard from '@/app/containers/vote/VoteCreateProposalFormCard'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const VoteProposalCreatePageHelper = () => {
  return (
    <Page title="Vote" subtitle="View and create proposals" headerCard={<TotalSupplyHeaderCard />}>
      <PageGrid>
        <Box px={[6, 0]}>
          <Text variant="heading">Create Proposal</Text>
        </Box>
        <VoteCreateProposalFormCard />
      </PageGrid>
    </Page>
  )
}

export default VoteProposalCreatePageHelper

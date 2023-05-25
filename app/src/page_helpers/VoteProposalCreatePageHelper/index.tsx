import Text from '@lyra/ui/components/Text'
import React from 'react'

import { PageId } from '@/app/constants/pages'
import TotalSupplyHeaderCard from '@/app/containers/common/TotalSupplyHeaderCard'
import VoteCreateProposalFormCard from '@/app/containers/vote/VoteCreateProposalFormCard'
import getPagePath from '@/app/utils/getPagePath'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const VoteProposalCreatePageHelper = () => {
  return (
    <Page
      title="Vote"
      showBackButton
      backHref={getPagePath({ page: PageId.VoteIndex })}
      subtitle="View and create proposals"
      headerCard={<TotalSupplyHeaderCard />}
    >
      <PageGrid>
        <Text variant="heading">Create Proposal</Text>
        <VoteCreateProposalFormCard />
      </PageGrid>
    </Page>
  )
}

export default VoteProposalCreatePageHelper

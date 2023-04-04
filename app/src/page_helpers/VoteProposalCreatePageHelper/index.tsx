import Box from '@lyra/ui/components/Box'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import VoteCreateProposalFormCard from '@/app/containers/vote/VoteCreateProposalFormCard'
import VotePageHeader from '@/app/containers/vote_index/VotePageHeader'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = MarginProps

const VoteProposalCreatePageHelper = ({}: Props) => {
  const isMobile = useIsMobile()
  return (
    <Page noHeaderPadding header={!isMobile ? <VotePageHeader showBackButton /> : null}>
      <PageGrid>
        {isMobile ? <VotePageHeader showBackButton /> : null}
        <Box px={[6, 0]}>
          <Text variant="heading">Create Proposal</Text>
        </Box>
        <VoteCreateProposalFormCard />
      </PageGrid>
    </Page>
  )
}

export default VoteProposalCreatePageHelper

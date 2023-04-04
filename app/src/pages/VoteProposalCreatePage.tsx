import React from 'react'

import withSuspense from '../hooks/data/withSuspense'
import PageLoading from '../page_helpers/common/Page/PageLoading'
import VoteProposalCreatePageHelper from '../page_helpers/VoteProposalCreatePageHelper'

const VoteProposalCreatePage = withSuspense(
  (): JSX.Element => {
    return <VoteProposalCreatePageHelper />
  },
  () => <PageLoading />
)

export default VoteProposalCreatePage

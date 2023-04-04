import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '../hooks/data/withSuspense'
import useVoteDetailsPageData from '../hooks/vote/useVoteDetailsPageData'
import PageError from '../page_helpers/common/Page/PageError'
import PageLoading from '../page_helpers/common/Page/PageLoading'
import VoteProposalDetailsPageHelper from '../page_helpers/VoteProposalDetailsPageHelper'

const VoteProposalDetailsPage = withSuspense(
  (): JSX.Element => {
    const { proposalId } = useParams()
    const data = useVoteDetailsPageData(proposalId)
    if (!proposalId || !data) {
      return <PageError error="Proposal does not exist." />
    }

    return <VoteProposalDetailsPageHelper data={data} />
  },
  () => <PageLoading />
)

export default VoteProposalDetailsPage

import React from 'react'

import VoteIndexPageHelper from '@/app/page_helpers/VoteIndexPageHelper'

import withSuspense from '../hooks/data/withSuspense'
import useVotePageData from '../hooks/vote/useVoteIndexPageData'
import PageLoading from '../page_helpers/common/Page/PageLoading'

const VoteIndexPage = withSuspense(
  (): JSX.Element => {
    const data = useVotePageData()
    return <VoteIndexPageHelper data={data} />
  },
  () => <PageLoading />
)

export default VoteIndexPage

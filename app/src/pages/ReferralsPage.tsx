import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import useReferralsPageData from '../hooks/referrals/useReferralsPageData'
import PageError from '../page_helpers/common/Page/PageError'
import ReferralsPageHelper from '../page_helpers/ReferralsPageHelper'

const ReferralsPage = withSuspense(
  () => {
    const data = useReferralsPageData()
    if (!data) {
      return <PageError error="No referral data" />
    }
    return <ReferralsPageHelper data={data} />
  },
  () => <PageLoading />
)

export default ReferralsPage

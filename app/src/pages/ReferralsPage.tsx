import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import useReferralsPageData from '../hooks/referrals/useReferralsPageData'
import PageError from '../page_helpers/common/Page/PageError'
import ReferralsPageHelper from '../page_helpers/ReferralsPageHelper'

const ReferralsPage = withSuspense(
  () => {
    const data = useReferralsPageData()
    const { network: networkStr } = useParams()
    if (networkStr !== Network.Arbitrum) {
      return <PageError error="Referrals are currently only available through Arbitrum" />
    }
    if (!data) {
      return <PageError error="No referral data" />
    }
    return <ReferralsPageHelper data={data} />
  },
  () => <PageLoading />
)

export default ReferralsPage

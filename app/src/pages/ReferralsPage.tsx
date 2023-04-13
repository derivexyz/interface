import { Network } from '@lyrafinance/lyra-js'
import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import useNetwork from '../hooks/account/useNetwork'
import useReferralsPageData from '../hooks/referrals/useReferralsPageData'
import PageError from '../page_helpers/common/Page/PageError'
import ReferralsPageHelper from '../page_helpers/ReferralsPageHelper'

const ReferralsPage = withSuspense(
  () => {
    const data = useReferralsPageData()
    const network = useNetwork()
    if (network !== Network.Arbitrum) {
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

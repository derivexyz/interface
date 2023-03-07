import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import useFaucetPageData from '../hooks/faucet/useFaucetPageData'
import FaucetPageHelper from '../page_helpers/FaucetPageHelper'

// /faucet
const FaucetPage = withSuspense(
  () => {
    const { marketBalances, ethBalance } = useFaucetPageData()
    return <FaucetPageHelper marketBalances={marketBalances} ethBalance={ethBalance} />
  },
  () => <PageLoading />
)

export default FaucetPage

import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import usePositionPageData from '@/app/hooks/position/usePositionPageData'
import PageError from '@/app/page_helpers/common/Page/PageError'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'
import PositionPageHelper from '@/app/page_helpers/PositionPageHelper'

// /position/:network/:marketAddressOrName/:positionId
const PositionPage = withSuspense(
  () => {
    const { position, option } = usePositionPageData()
    return position && option ? (
      <PositionPageHelper option={option} position={position} />
    ) : (
      <PageError error="Position does not exist" />
    )
  },
  () => <PageLoading />
)

export default PositionPage

import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import usePosition from '@/app/hooks/position/usePosition'
import LayoutPageError from '@/app/page_helpers/common/Layout/LayoutPageError'
import LayoutPageLoading from '@/app/page_helpers/common/Layout/LayoutPageLoading'
import PositionPageHelper from '@/app/page_helpers/PositionPageHelper'

// /position/:marketAddressOrName/:positionId
const PositionPage = withSuspense(
  () => {
    const { marketAddressOrName = null, positionId: positionIdStr } = useParams()
    const positionId = positionIdStr ? parseInt(positionIdStr) : NaN
    const { position, option } = usePosition(marketAddressOrName ?? null, !isNaN(positionId) ? positionId : null)
    return position && option ? (
      <PositionPageHelper option={option} position={position} />
    ) : (
      <LayoutPageError error="Position does not exist" />
    )
  },
  () => <LayoutPageLoading />
)

export default PositionPage

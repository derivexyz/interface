import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import usePosition from '@/app/hooks/position/usePosition'
import PageError from '@/app/page_helpers/common/Page/PageError'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'
import PositionPageHelper from '@/app/page_helpers/PositionPageHelper'

import coerce from '../utils/coerce'

// /position/:network/:marketAddressOrName/:positionId
const PositionPage = withSuspense(
  () => {
    const { marketAddressOrName = null, positionId: positionIdStr, network: networkStr } = useParams()
    const network = coerce(Network, networkStr) ?? null
    const positionId = positionIdStr ? parseInt(positionIdStr) : NaN
    const { position, option } = usePosition(network, marketAddressOrName, !isNaN(positionId) ? positionId : null)
    return position && option ? (
      <PositionPageHelper option={option} position={position} />
    ) : (
      <PageError error="Position does not exist" />
    )
  },
  () => <PageLoading />
)

export default PositionPage

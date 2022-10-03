import { PageId } from '@lyra/app/constants/pages'
import formatDate from '@lyra/ui/utils/formatDate'
import { useRouter } from 'next/router'
import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import useOption from '@/app/hooks/market/useOption'
import usePosition from '@/app/hooks/position/usePosition'
import LayoutPageError from '@/app/page_helpers/common/Layout/LayoutPageError'
import LayoutPageLoading from '@/app/page_helpers/common/Layout/LayoutPageLoading'
import MetaTags from '@/app/page_helpers/common/MetaTags'
import PositionPageHelper from '@/app/page_helpers/PositionPageHelper'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getPagePath from '@/app/utils/getPagePath'

const PositionPage = withSuspense(
  () => {
    const { query } = useRouter()
    const marketAddressOrName = query.market?.toString()
    const positionId = parseInt(query.id?.toString() ?? '')
    const position = usePosition(marketAddressOrName ?? null, !isNaN(positionId) ? positionId : null)
    const option = useOption(
      marketAddressOrName ?? null,
      position ? position.strikeId : null,
      position ? position.isCall : null
    )

    return position && option ? (
      <>
        <MetaTags
          title={`${position.isLong ? 'Long' : 'Short'} ${fromBigNumber(position.size)} ${
            position.marketName
          } ${fromBigNumber(position.strikePrice)} ${position.isCall ? 'Call' : 'Put'} - ${formatDate(
            position.expiryTimestamp,
            true
          )} Exp`}
          url={getPagePath(
            { page: PageId.Position, marketAddressOrName: position.marketName, positionId: position.id },
            true
          )}
        />
        <PositionPageHelper option={option} position={position} />
      </>
    ) : (
      <LayoutPageError error="Position does not exist" />
    )
  },
  () => <LayoutPageLoading />
)

export default PositionPage

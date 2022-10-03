import formatDateTime from '@lyra/ui/utils/formatDateTime'
import { useRouter } from 'next/router'
import React from 'react'

import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useBoard from '@/app/hooks/market/useBoard'
import AdminBoardPageHelper from '@/app/page_helpers/AdminBoardPageHelper'
import LayoutPageError from '@/app/page_helpers/common/Layout/LayoutPageError'
import LayoutPageLoading from '@/app/page_helpers/common/Layout/LayoutPageLoading'
import MetaTags from '@/app/page_helpers/common/MetaTags'
import getPagePath from '@/app/utils/getPagePath'

const AdminBoardPage = withSuspense(
  () => {
    const { query } = useRouter()
    const marketAddressOrName = query.market?.toString()
    const boardId = parseInt(query.id?.toString() ?? '')
    const board = useBoard(marketAddressOrName ?? null, !isNaN(boardId) ? boardId : null)
    return !board ? (
      <LayoutPageError error="Board does not exist" />
    ) : (
      <>
        <MetaTags
          title={`${board.market().name} Admin - ${formatDateTime(board.expiryTimestamp, true)} Exp`}
          url={getPagePath({ page: PageId.AdminBoard, marketAddressOrName: board.market().name, boardId: board.id })}
        />
        <AdminBoardPageHelper board={board} />
      </>
    )
  },
  () => <LayoutPageLoading />
)

export default AdminBoardPage

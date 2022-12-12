import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import useBoard from '@/app/hooks/market/useBoard'
import AdminBoardPageHelper from '@/app/page_helpers/AdminBoardPageHelper'
import LayoutPageError from '@/app/page_helpers/common/Layout/LayoutPageError'
import LayoutPageLoading from '@/app/page_helpers/common/Layout/LayoutPageLoading'

// /admin/:marketAddressOrName/:boardId
const AdminBoardPage = withSuspense(
  () => {
    const { marketAddressOrName = null, boardId: boardIdStr } = useParams()
    const boardId = boardIdStr ? parseInt(boardIdStr) : NaN
    const board = useBoard(marketAddressOrName, !isNaN(boardId) ? boardId : null)
    return !board ? <LayoutPageError error="Board does not exist" /> : <AdminBoardPageHelper board={board} />
  },
  () => <LayoutPageLoading />
)

export default AdminBoardPage

import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import AdminBoardPageHelper from '@/app/page_helpers/AdminBoardPageHelper'
import PageError from '@/app/page_helpers/common/Page/PageError'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import useAdminPageData from '../hooks/admin/useAdminPageData'
import useFindMarket from '../hooks/market/useFindMarket'
import coerce from '../utils/coerce'

// /admin/:network/:marketAddressOrName/:boardId
const AdminBoardPage = withSuspense(
  () => {
    const { marketAddressOrName = null, boardId: boardIdStr, network: networkStr } = useParams()
    const boardId = boardIdStr ? parseInt(boardIdStr) : NaN
    const network = coerce(Network, networkStr) ?? null
    const { marketsWithGlobalCaches } = useAdminPageData()
    const markets = marketsWithGlobalCaches.map(({ market }) => market)
    const market = useFindMarket(markets, network, marketAddressOrName)
    const selectedBoard = useMemo(() => market?.liveBoards().find(b => b.id === boardId), [boardId, market])
    return !selectedBoard || !network ? (
      <PageError error="Board does not exist" />
    ) : (
      <AdminBoardPageHelper markets={markets} selectedBoard={selectedBoard} />
    )
  },
  () => <PageLoading />
)

export default AdminBoardPage

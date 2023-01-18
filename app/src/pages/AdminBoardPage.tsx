import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import useBoard from '@/app/hooks/market/useBoard'
import AdminBoardPageHelper from '@/app/page_helpers/AdminBoardPageHelper'
import PageError from '@/app/page_helpers/common/Page/PageError'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import useMarket from '../hooks/market/useMarket'
import coerce from '../utils/coerce'

// /admin/:network/:marketAddressOrName/:boardId
const AdminBoardPage = withSuspense(
  () => {
    const { marketAddressOrName = null, boardId: boardIdStr, network: networkStr } = useParams()
    const boardId = boardIdStr ? parseInt(boardIdStr) : NaN
    const network = coerce(Network, networkStr) ?? null
    const market = useMarket(network, marketAddressOrName)
    const board = useBoard(market, !isNaN(boardId) ? boardId : null)
    return !board || !network ? <PageError error="Board does not exist" /> : <AdminBoardPageHelper board={board} />
  },
  () => <PageLoading />
)

export default AdminBoardPage

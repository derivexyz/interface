import { Board } from '@lyrafinance/lyra-js'
import React, { useCallback } from 'react'

import { PageId } from '@/app/constants/pages'
import AdminBoardAddStrike from '@/app/containers/admin/AdminBoardAddStrike'
import AdminBoardBaseIv from '@/app/containers/admin/AdminBoardBaseIv'
import AdminBoardInfo from '@/app/containers/admin/AdminBoardInfo'
import AdminBoardStrikes from '@/app/containers/admin/AdminBoardStrikes'
import AdminMarketSelect from '@/app/containers/admin/AdminMarketSelect'
import AdminTransactionCard from '@/app/containers/admin/AdminTransactionCard'
import withSuspense from '@/app/hooks/data/withSuspense'
import { useMutateBoard } from '@/app/hooks/market/useBoard'
import useMarketOwner from '@/app/hooks/market/useMarketOwner'
import getPagePath from '@/app/utils/getPagePath'

import Page from '../common/Page'
import PageError from '../common/Page/PageError'
import PageGrid from '../common/Page/PageGrid'
import PageLoading from '../common/Page/PageLoading'

type Props = {
  board: Board
}

const AdminBoardPageHelper = withSuspense(
  ({ board }: Props) => {
    const market = board.market()
    const owner = useMarketOwner(market)
    const mutateBoard = useMutateBoard(market.lyra)
    const handleUpdateBoard = useCallback(
      () => mutateBoard(market.address, board.id),
      [mutateBoard, market.address, board.id]
    )
    if (!market || !board || !owner) {
      return <PageError error="Board does not exist" />
    }
    return (
      <Page
        desktopRightColumn={<AdminTransactionCard height="80vh" overflow="auto" />}
        showBackButton
        backHref={getPagePath({
          page: PageId.AdminMarket,
          network: market.lyra.network,
          marketAddressOrName: market.baseToken.symbol.slice(1, market.baseToken.symbol.length),
        })}
      >
        <PageGrid>
          <AdminMarketSelect marketAddressOrName={market.address} />
          <AdminBoardInfo market={market} board={board} owner={owner} onUpdateBoard={handleUpdateBoard} />
          <AdminBoardBaseIv market={market} board={board} owner={owner} onUpdateBoard={handleUpdateBoard} />
          <AdminBoardAddStrike market={market} board={board} owner={owner} onAddStrike={handleUpdateBoard} />
          <AdminBoardStrikes board={board} owner={owner} onUpdateStrike={handleUpdateBoard} />
        </PageGrid>
      </Page>
    )
  },
  () => <PageLoading />
)

export default AdminBoardPageHelper

import { Board } from '@lyrafinance/lyra-js'
import React from 'react'

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

import Layout from '../common/Layout'
import LayoutGrid from '../common/Layout/LayoutGrid'
import LayoutPageError from '../common/Layout/LayoutPageError'
import LayoutPageLoading from '../common/Layout/LayoutPageLoading'

type Props = {
  board: Board | null
}

const AdminBoardPageHelper = withSuspense(
  ({ board }: Props) => {
    const market = board?.market()
    const owner = useMarketOwner(market?.address ?? null)
    const mutateBoard = useMutateBoard(market?.address ?? null, board?.id ?? null)
    if (!market || !board || !owner) {
      return <LayoutPageError error="Board does not exist" />
    }
    return (
      <Layout
        desktopRightColumn={<AdminTransactionCard height="80vh" overflow="auto" />}
        showBackButton
        backHref={getPagePath({
          page: PageId.AdminMarket,
          marketAddressOrName: market.baseToken.symbol.slice(1, market.baseToken.symbol.length),
        })}
      >
        <LayoutGrid>
          <AdminMarketSelect marketAddressOrName={market.address} />
          <AdminBoardInfo market={market} board={board} owner={owner} onUpdateBoard={mutateBoard} />
          <AdminBoardBaseIv market={market} board={board} owner={owner} onUpdateBoard={mutateBoard} />
          <AdminBoardAddStrike market={market} board={board} owner={owner} onAddStrike={mutateBoard} />
          <AdminBoardStrikes board={board} owner={owner} onUpdateStrike={mutateBoard} />
        </LayoutGrid>
      </Layout>
    )
  },
  () => <LayoutPageLoading />
)

export default AdminBoardPageHelper

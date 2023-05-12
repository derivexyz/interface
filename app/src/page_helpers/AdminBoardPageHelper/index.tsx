import { Board, Market } from '@lyrafinance/lyra-js'
import React from 'react'

import { PageId } from '@/app/constants/pages'
import AdminBoardAddStrike from '@/app/containers/admin/AdminBoardAddStrike'
import AdminBoardBaseIv from '@/app/containers/admin/AdminBoardBaseIv'
import AdminBoardInfo from '@/app/containers/admin/AdminBoardInfo'
import AdminBoardStrikes from '@/app/containers/admin/AdminBoardStrikes'
import AdminMarketSelect from '@/app/containers/admin/AdminMarketSelect'
import AdminTransactionCard from '@/app/containers/admin/AdminTransactionCard'
import getPagePath from '@/app/utils/getPagePath'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  markets: Market[]
  selectedBoard: Board
}

const AdminBoardPageHelper = ({ markets, selectedBoard }: Props) => {
  const market = selectedBoard.market()
  const globalOwner = market.params.owner
  return (
    <Page
      backHref={getPagePath({
        page: PageId.Admin,
        network: market.lyra.network,
        marketAddressOrName: market.name,
      })}
      showBackButton
    >
      <PageGrid rightColumn={<AdminTransactionCard network={market.lyra.network} globalOwner={globalOwner} />}>
        <AdminMarketSelect markets={markets} selectedMarket={market} />
        <AdminBoardInfo board={selectedBoard} />
        <AdminBoardBaseIv board={selectedBoard} />
        <AdminBoardAddStrike board={selectedBoard} />
        <AdminBoardStrikes board={selectedBoard} />
      </PageGrid>
    </Page>
  )
}

export default AdminBoardPageHelper

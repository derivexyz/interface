import React from 'react'

import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarket from '@/app/hooks/market/useMarket'
import AdminMarketPageHelper from '@/app/page_helpers/AdminMarketPageHelper'
import LayoutPageError from '@/app/page_helpers/common/Layout/LayoutPageError'
import LayoutPageLoading from '@/app/page_helpers/common/Layout/LayoutPageLoading'
import MetaTags from '@/app/page_helpers/common/MetaTags'
import getPagePath from '@/app/utils/getPagePath'
import lyraBuild from '@/app/utils/lyraBuild'

export const getStaticPaths = async () => {
  const markets = await lyraBuild.markets()
  console.log(
    'generating /admin pages for...',
    markets.map(m => m.name.toLowerCase())
  )
  const paths = markets.map(({ name }) => ({
    params: { marketName: name.toLowerCase() },
  }))
  return { paths, fallback: false }
}

export const getStaticProps = async ({ params: { marketName } }: { params: { marketName: string } }) => {
  return { props: { marketName } }
}

const AdminMarketPage = withSuspense(
  ({ marketName }: { marketName: string }) => {
    const market = useMarket(marketName)
    return !market ? (
      <LayoutPageError error="Market does not exist" />
    ) : (
      <>
        <MetaTags
          title={`${market.name} Admin`}
          url={getPagePath({ page: PageId.AdminMarket, marketAddressOrName: market.name })}
        />
        <AdminMarketPageHelper market={market} />
      </>
    )
  },
  () => <LayoutPageLoading />
)

export default AdminMarketPage

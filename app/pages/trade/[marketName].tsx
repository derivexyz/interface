import formatUSD from '@lyra/ui/utils/formatUSD'
import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import useMarket from '@/app/hooks/market/useMarket'
import LayoutPageError from '@/app/page_helpers/common/Layout/LayoutPageError'
import LayoutPageLoading from '@/app/page_helpers/common/Layout/LayoutPageLoading'
import MetaTags from '@/app/page_helpers/common/MetaTags'
import lyraBuild from '@/app/utils/lyraBuild'

import TradePageHelper from '../../page_helpers/TradePageHelper'

export const getStaticPaths = async () => {
  const markets = await lyraBuild.markets()
  console.log(
    'generating /trade pages for...',
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

const TradePage = withSuspense(
  ({ marketName }: { marketName: string }) => {
    const market = useMarket(marketName)
    return !market ? (
      <LayoutPageError error="Market does not exist" />
    ) : (
      <>
        <MetaTags title={`${market.name} ${formatUSD(market.spotPrice)}`} />
        <TradePageHelper market={market} />
      </>
    )
  },
  () => <LayoutPageLoading />
)

export default TradePage

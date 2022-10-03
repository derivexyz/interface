import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import useMarket from '@/app/hooks/market/useMarket'
import LayoutPageError from '@/app/page_helpers/common/Layout/LayoutPageError'
import LayoutPageLoading from '@/app/page_helpers/common/Layout/LayoutPageLoading'
import MetaTags from '@/app/page_helpers/common/MetaTags'
import VaultsPageHelper from '@/app/page_helpers/VaultsPageHelper'
import getPagePath from '@/app/utils/getPagePath'
import lyraBuild from '@/app/utils/lyraBuild'

import { PageId } from '../../constants/pages'

export const getStaticPaths = async () => {
  const markets = await lyraBuild.markets()
  console.log(
    'generating /vaults pages for...',
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

const VaultsPage = withSuspense(
  ({ marketName }: { marketName: string }) => {
    const market = useMarket(marketName)
    return !market ? (
      <LayoutPageError error="Vault does not exist" />
    ) : (
      <>
        <MetaTags
          title={`${market.name} Vault`}
          url={getPagePath({ page: PageId.Vaults, marketAddressOrName: market.name })}
        />
        <VaultsPageHelper market={market} />
      </>
    )
  },
  () => <LayoutPageLoading />
)

export default VaultsPage

import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import LayoutPageError from '@/app/page_helpers/common/Layout/LayoutPageError'
import LayoutPageLoading from '@/app/page_helpers/common/Layout/LayoutPageLoading'

import useMarket from '../hooks/market/useMarket'
import TradePageHelper from '../page_helpers/TradePageHelper'

// /trade/:marketAddressOrName
const TradePage = withSuspense(
  () => {
    const { marketAddressOrName = null } = useParams()
    const market = useMarket(marketAddressOrName)
    return !market ? <LayoutPageError error="Market does not exist" /> : <TradePageHelper market={market} />
  },
  () => <LayoutPageLoading />
)

export default TradePage

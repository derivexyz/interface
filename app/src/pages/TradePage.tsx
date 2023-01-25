import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import PageError from '@/app/page_helpers/common/Page/PageError'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import useFindMarket from '../hooks/market/useFindMarket'
import useTradePageData from '../hooks/market/useTradePageData'
import TradePageHelper from '../page_helpers/TradePageHelper'
import coerce from '../utils/coerce'

// /trade/:network/:marketAddressOrName
const TradePage = withSuspense(
  () => {
    const { marketAddressOrName = null, network: networkStr } = useParams()
    const network = coerce(Network, networkStr) ?? null
    const { markets, openPositions } = useTradePageData()

    const selectedMarket = useFindMarket(markets, network, marketAddressOrName)

    return !selectedMarket ? (
      <PageError error="Market does not exist" />
    ) : (
      <TradePageHelper markets={markets} selectedMarket={selectedMarket} openPositions={openPositions} />
    )
  },
  () => <PageLoading />
)

export default TradePage

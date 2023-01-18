import { Network } from '@lyrafinance/lyra-js'
import React from 'react'
import { useParams } from 'react-router-dom'

import withSuspense from '@/app/hooks/data/withSuspense'
import PageError from '@/app/page_helpers/common/Page/PageError'
import PageLoading from '@/app/page_helpers/common/Page/PageLoading'

import useMarket from '../hooks/market/useMarket'
import TradePageHelper from '../page_helpers/TradePageHelper'
import coerce from '../utils/coerce'

// /trade/:marketAddressOrName
const TradePage = withSuspense(
  () => {
    const { marketAddressOrName = null, network: networkStr } = useParams()
    const network = coerce(Network, networkStr) ?? null
    const market = useMarket(network, marketAddressOrName)
    return !market || !network ? <PageError error="Market does not exist" /> : <TradePageHelper market={market} />
  },
  () => <PageLoading />
)

export default TradePage

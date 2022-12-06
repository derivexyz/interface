import { Network } from '@lyrafinance/lyra-js'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { getDefaultMarket } from '../constants/defaults'
import { PageId } from '../constants/pages'
import getPagePath from '../utils/getPagePath'
import TradePage from './trade/[marketName]'

export default function TradeRedirect(): JSX.Element {
  const { push } = useRouter()
  useEffect(() => {
    push(getPagePath({ page: PageId.Trade, marketAddressOrName: getDefaultMarket(Network.Optimism) }), undefined, {
      shallow: true,
    })
  }, [push])
  return <TradePage marketName={getDefaultMarket(Network.Optimism)} />
}

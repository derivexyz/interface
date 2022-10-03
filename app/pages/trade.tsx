import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

import { DEFAULT_MARKET } from '../constants/defaults'
import { PageId } from '../constants/pages'
import getPagePath from '../utils/getPagePath'
import TradePage from './trade/[marketName]'

export default function TradeRedirect(): JSX.Element {
  const { push } = useRouter()
  useEffect(() => {
    push(getPagePath({ page: PageId.Trade, marketAddressOrName: DEFAULT_MARKET }), undefined, { shallow: true })
  }, [push])
  return <TradePage marketName={DEFAULT_MARKET} />
}

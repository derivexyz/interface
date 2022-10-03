import Box from '@lyra/ui/components/Box'
import Grid from '@lyra/ui/components/Grid'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Option } from '@lyrafinance/lyra-js'
import React from 'react'

import { UNIT } from '@/app/constants/bn'
import { MAX_IV } from '@/app/constants/contracts'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getDefaultQuoteSize from '@/app/utils/getDefaultQuoteSize'

import LabelItem from '../LabelItem'

type Props = {
  option: Option
  isBuy: boolean
}

const OptionStatsGrid = ({ option, isBuy }: Props) => {
  const size = getDefaultQuoteSize(option.market().name)
  const bid = option.quoteSync(true, size)
  const ask = option.quoteSync(false, size)
  const quote = isBuy ? bid : ask
  const openInterest = option.longOpenInterest.add(option.shortOpenInterest).mul(option.market().spotPrice).div(UNIT)
  const isMobile = useIsMobile()
  return (
    <Grid sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr 1fr'], gridColumnGap: [3, 6], gridRowGap: 8 }}>
      <LabelItem
        label="Bid"
        value={!ask.isDisabled && ask.pricePerOption.gt(0) ? formatUSD(ask.pricePerOption) : '-'}
      />
      <LabelItem
        label="Ask"
        value={!bid.isDisabled && bid.pricePerOption.gt(0) ? formatUSD(bid.pricePerOption) : '-'}
      />
      <LabelItem
        label="Implied Volatility"
        value={quote.iv.gt(0) && quote.iv.lt(MAX_IV) ? formatPercentage(fromBigNumber(quote.iv), true) : '-'}
      />
      <LabelItem label="Open Interest" value={openInterest.gt(0) ? formatTruncatedUSD(openInterest) : '-'} />
      {!isMobile ? <Box /> : null}
      <LabelItem label="Delta" value={formatNumber(quote.greeks.delta, { dps: 3 })} />
      <LabelItem label="Vega" value={formatNumber(quote.greeks.vega, { dps: 3 })} />
      <LabelItem label="Gamma" value={formatNumber(quote.greeks.gamma, { dps: 3 })} />
      <LabelItem label="Theta" value={formatNumber(quote.greeks.theta, { dps: 3 })} />
      <LabelItem label="Rho" value={formatNumber(quote.greeks.rho, { dps: 3 })} />
    </Grid>
  )
}

export default OptionStatsGrid

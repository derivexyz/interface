import Grid from '@lyra/ui/components/Grid'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Option, Quote } from '@lyrafinance/lyra-js'
import React from 'react'

import { UNIT } from '@/app/constants/bn'
import { MAX_IV } from '@/app/constants/contracts'
import fromBigNumber from '@/app/utils/fromBigNumber'

import LabelItem from '../LabelItem'

type Props = {
  option: Option
  bid: Quote | null
  ask: Quote | null
}

const OptionStatsGrid = ({ option, bid, ask }: Props) => {
  const openInterest = option.longOpenInterest.add(option.shortOpenInterest).mul(option.market().spotPrice).div(UNIT)
  return (
    <Grid sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr 1fr'], gridColumnGap: [3, 6], gridRowGap: [3, 6] }}>
      <LabelItem
        label="Bid"
        value={bid && !bid.isDisabled && bid.pricePerOption.gt(0) ? formatUSD(bid.pricePerOption) : '-'}
      />
      <LabelItem
        label="Ask"
        value={ask && !ask.isDisabled && ask.pricePerOption.gt(0) ? formatUSD(ask.pricePerOption) : '-'}
      />
      <LabelItem
        label="Bid IV"
        value={bid && bid.iv.gt(0) && bid.iv.lt(MAX_IV) ? formatPercentage(fromBigNumber(bid.iv), true) : '-'}
      />
      <LabelItem
        label="Ask IV"
        value={ask && ask.iv.gt(0) && ask.iv.lt(MAX_IV) ? formatPercentage(fromBigNumber(ask.iv), true) : '-'}
      />
      <LabelItem label="Open Interest" value={formatTruncatedUSD(openInterest)} />
      <LabelItem label="Delta" value={formatNumber(option.delta, { dps: 3 })} />
      <LabelItem label="Vega" value={formatNumber(option.strike().vega, { dps: 3 })} />
      <LabelItem label="Gamma" value={formatNumber(option.strike().gamma, { dps: 3 })} />
      <LabelItem label="Theta" value={formatNumber(option.theta, { dps: 3 })} />
      <LabelItem label="Rho" value={formatNumber(option.rho, { dps: 3 })} />
    </Grid>
  )
}

export default OptionStatsGrid

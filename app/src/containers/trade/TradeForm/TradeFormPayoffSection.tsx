import CardSection from '@lyra/ui/components/Card/CardSection'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Trade } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import PayoffChart from '@/app/components/common/PayoffChart'
import RowItem from '@/app/components/common/RowItem'
import { MAX_BN } from '@/app/constants/bn'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  trade: Trade
}

const TradeFormPayoffSection = ({ trade }: Props) => {
  const [hoverPayoff, setHoverPayoff] = useState<number | null>(null)
  const spotPrice = trade.market().spotPrice
  const expectedPayoffAtSpot = fromBigNumber(trade.payoff(spotPrice))
  const expectedPayoff = hoverPayoff ?? expectedPayoffAtSpot

  const maxProfit = trade.maxProfit()
  const maxLoss = trade.maxLoss()
  const breakEven = trade.breakEven()

  return (
    <CardSection>
      <RowItem
        label="Expected Profit / Loss"
        value={formatUSD(expectedPayoff, { showSign: true })}
        valueColor={expectedPayoff >= 0 ? 'primaryText' : 'errorText'}
        mb={6}
      />
      <PayoffChart
        height={120}
        tradeOrPosition={trade}
        onHover={pt => setHoverPayoff(pt?.payoff ?? null)}
        showLiquidationPrice
        mb={6}
      />
      <RowItem mb={3} label="Max Profit" value={maxProfit.eq(MAX_BN) ? 'Infinity' : formatUSD(maxProfit)} />
      <RowItem mb={3} label="Break Even" value={formatUSD(breakEven)} />
      <RowItem label="Max Loss" value={maxLoss.eq(MAX_BN) ? 'Infinity' : formatUSD(maxLoss)} />
    </CardSection>
  )
}

export default TradeFormPayoffSection

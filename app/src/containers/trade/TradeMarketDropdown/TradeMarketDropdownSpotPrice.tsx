import Flex from '@lyra/ui/components/Flex'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market, SnapshotPeriod } from '@lyrafinance/lyra-js'
import React from 'react'

import { ChartInterval } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useSpotPriceHistory from '@/app/hooks/market/useSpotPriceHistory'

type Props = {
  market: Market
}

const TradeMarketDropdownSpotPrice = withSuspense(
  ({ market }: Props) => {
    const history = useSpotPriceHistory(market, ChartInterval.OneDay, SnapshotPeriod.EightHours)
    const latestSnapshot = history[history.length - 1]
    const latestPrice = latestSnapshot.close
    const startPrice = history[0].close
    const change = startPrice ? (latestPrice - startPrice) / startPrice : 0
    const color = change >= 0 ? 'primaryText' : 'errorText'
    return (
      <Flex width={80} flexDirection="column" alignItems="flex-end">
        <Text>{formatUSD(latestPrice)}</Text>
        <Text color={color} variant="small">
          {formatPercentage(change)}
        </Text>
      </Flex>
    )
  },
  () => (
    <Flex width={80} flexDirection="column" alignItems="flex-end">
      <TextShimmer variant="small" width={80} />
      <TextShimmer variant="small" width={50} />
    </Flex>
  )
)

export default TradeMarketDropdownSpotPrice

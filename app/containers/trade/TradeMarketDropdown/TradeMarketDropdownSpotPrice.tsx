import Flex from '@lyra/ui/components/Flex'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import useSpotPriceHistory from '@/app/hooks/data/useSpotPriceHistory'
import withSuspense from '@/app/hooks/data/withSuspense'

type Props = {
  market: Market
}

const TradeMarketDropdownSpotPrice = withSuspense(
  ({ market }: Props) => {
    const history = useSpotPriceHistory(market.address, ChartPeriod.OneDay)
    const latestSnapshot = history[history.length - 1]
    const color = latestSnapshot.change >= 0 ? 'primaryText' : 'errorText'
    return (
      <Flex width={80} flexDirection="column" alignItems="flex-end">
        <Text variant="secondary">{formatUSD(latestSnapshot.price)}</Text>
        <Text color={color} variant="small">
          {formatPercentage(latestSnapshot.change)}
        </Text>
      </Flex>
    )
  },
  () => (
    <Flex width={80} flexDirection="column" alignItems="flex-end">
      <TextShimmer variant="secondary" width={80} />
      <TextShimmer variant="small" width={50} />
    </Flex>
  )
)

export default TradeMarketDropdownSpotPrice

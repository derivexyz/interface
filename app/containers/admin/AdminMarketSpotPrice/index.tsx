import Box from '@lyra/ui/components/Box'
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

const AdminMarketSpotPrice = withSuspense(
  ({ market }: Props) => {
    const history = useSpotPriceHistory(market.address, ChartPeriod.OneDay)
    const latestSnapshot = history[history.length - 1]
    const color = latestSnapshot && latestSnapshot.change >= 0 ? 'primaryText' : 'errorText'
    return (
      <Box>
        <Flex mx={8} mt={1} flexDirection="column">
          <Text color={color} variant="heading">
            {formatUSD(market?.spotPrice ?? 0)}
          </Text>
          <Text color={color} variant="body">
            {formatPercentage(latestSnapshot?.change ?? 0)}
          </Text>
        </Flex>
      </Box>
    )
  },
  () => (
    <Flex mx={8} mt={1} flexDirection="column">
      <TextShimmer width={200} variant="heading" />
      <TextShimmer width={140} variant="body" />
    </Flex>
  )
)

export default AdminMarketSpotPrice

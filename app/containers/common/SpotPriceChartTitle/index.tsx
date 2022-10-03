import Box from '@lyra/ui/components/Box'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text, { TextVariant } from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import useSpotPriceHistory from '@/app/hooks/data/useSpotPriceHistory'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarket from '@/app/hooks/market/useMarket'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  textVariant?: TextVariant
  marketAddressOrName: string
  hoverSpotPrice: number | null
  period: ChartPeriod
} & MarginProps

const SpotPriceCardTitle = withSuspense(
  ({ textVariant = 'title', marketAddressOrName, hoverSpotPrice, period, ...styleProps }: Props) => {
    const market = useMarket(marketAddressOrName)
    const history = useSpotPriceHistory(market?.name ?? null, period)
    const latestSpotPrice = market?.spotPrice
    const spotPrice = hoverSpotPrice ?? (latestSpotPrice ? fromBigNumber(latestSpotPrice) : null)
    const prevSpotPrice = history.length > 0 ? history[0].price : null
    const pctChange = spotPrice && prevSpotPrice ? (spotPrice - prevSpotPrice) / prevSpotPrice : 0
    return (
      <Box {...styleProps}>
        <Text variant={textVariant}>{spotPrice ? formatUSD(spotPrice) : '-'}</Text>
        <Text variant="smallMedium" color={pctChange < 0 ? 'errorText' : 'primaryText'}>
          {formatPercentage(pctChange)}
        </Text>
      </Box>
    )
  },
  ({ textVariant = 'title', marketAddressOrName, hoverSpotPrice, period, ...styleProps }: Props) => (
    <Box {...styleProps}>
      <TextShimmer variant={textVariant} width={200} />
      <TextShimmer variant="smallMedium" width={50} />
    </Box>
  )
)

export default SpotPriceCardTitle

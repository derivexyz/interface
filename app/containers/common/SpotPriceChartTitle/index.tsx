import Box from '@lyra/ui/components/Box'
import { OhlcData } from '@lyra/ui/components/CandleChart'
import Flex from '@lyra/ui/components/Flex'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text, { TextVariant } from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import useSpotPriceHistory from '@/app/hooks/data/useSpotPriceHistory'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarket from '@/app/hooks/market/useMarket'
import fromBigNumber from '@/app/utils/fromBigNumber'

// TODO @michaelxuwu add enum market name support
const getOhlcWidthForMarket = (marketName: string) => {
  switch (marketName.toLowerCase()) {
    case 'btc':
      return 100
    case 'sol':
      return 75
    default:
      return 90
  }
}

type Props = {
  textVariant?: TextVariant
  marketAddressOrName: string
  hoverSpotPrice: number | null
  period: ChartPeriod
  isCandleChart?: boolean
  hoverCandle?: OhlcData | null
} & MarginProps

const SpotPriceChartTitle = withSuspense(
  ({
    textVariant = 'title',
    marketAddressOrName,
    hoverSpotPrice,
    period,
    hoverCandle,
    isCandleChart = false,
    ...styleProps
  }: Props) => {
    const isMobile = useIsMobile()
    const market = useMarket(marketAddressOrName)
    const history = useSpotPriceHistory(market?.name ?? null, period)
    const latestSpotPrice = market?.spotPrice
    const spotPrice = hoverSpotPrice ?? (latestSpotPrice ? fromBigNumber(latestSpotPrice) : null)
    const prevSpotPrice = history.length > 0 ? history[0].price : null
    const pctChange = spotPrice && prevSpotPrice ? (spotPrice - prevSpotPrice) / prevSpotPrice : 0
    const candle = hoverCandle ?? (history.length > 0 ? history[history.length - 1] : null)
    const isCandleUp = candle ? candle?.close > candle?.open : false
    const ohlcLabelWidth = market ? getOhlcWidthForMarket(market.name) : 90
    return (
      <Box {...styleProps}>
        <Text variant={textVariant}>{spotPrice ? formatUSD(spotPrice) : '-'}</Text>
        {isCandleChart ? (
          <Box
            display={isMobile ? 'grid' : 'flex'}
            sx={{
              gridTemplateColumns: isMobile ? `repeat(2, ${ohlcLabelWidth}px)` : `repeat(4, ${ohlcLabelWidth}px)`,
              columnGap: isMobile ? 0 : 1,
            }}
          >
            <Flex width={ohlcLabelWidth}>
              <Text variant="small" color="secondaryText">
                {isMobile ? 'O:' : 'Open:'}
              </Text>
              <Text ml={1} variant="smallMedium" color={isCandleUp ? 'primaryText' : 'errorText'}>
                {formatUSD(candle?.open ?? 0)}
              </Text>
            </Flex>
            <Flex ml={[0, 2]} width={ohlcLabelWidth}>
              <Text variant="small" color="secondaryText">
                {isMobile ? 'H:' : 'High:'}
              </Text>
              <Text ml={1} variant="smallMedium" color={isCandleUp ? 'primaryText' : 'errorText'}>
                {formatUSD(candle?.high ?? 0)}
              </Text>
            </Flex>
            <Flex ml={[0, 2]} width={ohlcLabelWidth}>
              <Text variant="small" color="secondaryText">
                {isMobile ? 'L:' : 'Low:'}
              </Text>
              <Text ml={1} variant="smallMedium" color={isCandleUp ? 'primaryText' : 'errorText'}>
                {formatUSD(candle?.low ?? 0)}
              </Text>
            </Flex>
            <Flex ml={[0, 1]} width={ohlcLabelWidth}>
              <Text variant="small" color="secondaryText">
                {isMobile ? 'C:' : 'Close:'}
              </Text>
              <Text ml={1} variant="smallMedium" color={isCandleUp ? 'primaryText' : 'errorText'}>
                {formatUSD(candle?.close ?? 0)}
              </Text>
            </Flex>
          </Box>
        ) : (
          <Text variant="smallMedium" color={pctChange < 0 ? 'errorText' : 'primaryText'}>
            {formatPercentage(pctChange)}
          </Text>
        )}
      </Box>
    )
  },
  ({ textVariant = 'title', marketAddressOrName, hoverSpotPrice, period, hoverCandle, ...styleProps }: Props) => (
    <Box {...styleProps}>
      <TextShimmer variant={textVariant} width={200} />
      <TextShimmer variant="smallMedium" width={50} />
    </Box>
  )
)

export default SpotPriceChartTitle

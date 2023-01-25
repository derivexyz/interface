import Box from '@lyra/ui/components/Box'
import { OhlcData } from '@lyra/ui/components/CandleChart'
import Flex from '@lyra/ui/components/Flex'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text, { TextVariant } from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useSpotPriceHistory from '@/app/hooks/market/useSpotPriceHistory'
import fromBigNumber from '@/app/utils/fromBigNumber'

const getOhlcWidthForToken = (token: string) => {
  switch (token.toLowerCase()) {
    case 'btc':
    case 'sbtc':
      return 100
    case 'sol':
    case 'ssol':
      return 75
    default:
      return 90
  }
}

type Props = {
  market: Market
  textVariant?: TextVariant
  hoverSpotPrice: number | null
  period: ChartPeriod
  isCandleChart?: boolean
  hoverCandle?: OhlcData | null
} & MarginProps

const SpotPriceChartTitle = withSuspense(
  ({
    market,
    textVariant = 'title',
    hoverSpotPrice,
    period,
    hoverCandle,
    isCandleChart = false,
    ...styleProps
  }: Props) => {
    const isMobile = useIsMobile()
    const history = useSpotPriceHistory(market, period)
    const latestSpotPrice = fromBigNumber(market.spotPrice)
    const spotPrice = hoverSpotPrice ?? latestSpotPrice
    const prevSpotPrice = history.length > 0 ? history[0].price : null
    const pctChange = prevSpotPrice && prevSpotPrice > 0 ? (spotPrice - prevSpotPrice) / prevSpotPrice : 0
    const candle = hoverCandle ?? (history.length > 0 ? history[history.length - 1] : null)
    const isCandleUp = candle ? candle?.close > candle?.open : false
    const ohlcLabelWidth = market ? getOhlcWidthForToken(market.baseToken.symbol) : 90
    return (
      <Box {...styleProps}>
        <Text variant={textVariant}>{formatUSD(spotPrice)}</Text>
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
  ({ textVariant = 'title', market, hoverSpotPrice, period, hoverCandle, ...styleProps }: Props) => (
    <Box {...styleProps}>
      <TextShimmer variant={textVariant} width={200} />
      <TextShimmer variant="smallMedium" width={50} />
    </Box>
  )
)

export default SpotPriceChartTitle

import Box from '@lyra/ui/components/Box'
import { OhlcData } from '@lyra/ui/components/CandleChart'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text, { TextVariant } from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import { ChartInterval } from '@/app/constants/chart'
import withSuspense from '@/app/hooks/data/withSuspense'
import useSpotPriceHistory from '@/app/hooks/market/useSpotPriceHistory'
import fromBigNumber from '@/app/utils/fromBigNumber'

const getOhlcWidthForToken = (token: string) => {
  switch (token.toLowerCase()) {
    case 'btc':
    case 'wbtc':
    case 'sbtc':
      return 124
    case 'eth':
    case 'weth':
    case 'seth':
    default:
      return 112
  }
}

type Props = {
  market: Market
  textVariant?: TextVariant
  hoverSpotPrice: number | null
  interval: ChartInterval
  isCandleChart?: boolean
  hoverCandle?: OhlcData | null
} & MarginProps

const SpotPriceChartTitle = withSuspense(
  ({
    market,
    textVariant = 'cardHeading',
    hoverSpotPrice,
    interval,
    hoverCandle,
    isCandleChart = false,
    ...styleProps
  }: Props) => {
    const isMobile = useIsMobile()
    const history = useSpotPriceHistory(market, interval)
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
            display="grid"
            sx={{
              gridTemplateColumns: [`repeat(2, ${ohlcLabelWidth}px)`, `repeat(4, ${ohlcLabelWidth}px)`],
            }}
          >
            <Text variant="small" color="secondaryText">
              {isMobile ? 'O: ' : 'Open: '}
              <Text as="span" color={isCandleUp ? 'primaryText' : 'errorText'}>
                {formatUSD(candle?.open ?? 0)}
              </Text>
            </Text>
            <Text variant="small" color="secondaryText">
              {isMobile ? 'H: ' : 'High: '}
              <Text as="span" color={isCandleUp ? 'primaryText' : 'errorText'}>
                {formatUSD(candle?.high ?? 0)}
              </Text>
            </Text>
            <Text variant="small" color="secondaryText">
              {isMobile ? 'L: ' : 'Low: '}
              <Text as="span" color={isCandleUp ? 'primaryText' : 'errorText'}>
                {formatUSD(candle?.low ?? 0)}
              </Text>
            </Text>
            <Text variant="small" color="secondaryText">
              {isMobile ? 'C: ' : 'Close: '}
              <Text as="span" color={isCandleUp ? 'primaryText' : 'errorText'}>
                {formatUSD(candle?.close ?? 0)}
              </Text>
            </Text>
          </Box>
        ) : (
          <Text variant="small" color={pctChange < 0 ? 'errorText' : 'primaryText'}>
            {formatPercentage(pctChange)}
          </Text>
        )}
      </Box>
    )
  },
  ({ textVariant = 'cardHeading', market, hoverSpotPrice, interval, hoverCandle, ...styleProps }: Props) => (
    <Box {...styleProps}>
      <TextShimmer variant={textVariant} width={100} />
      <TextShimmer variant="small" width={80} />
    </Box>
  )
)

export default SpotPriceChartTitle

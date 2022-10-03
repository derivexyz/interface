import { BigNumber } from '@ethersproject/bignumber'
import Flex from '@lyra/ui/components/Flex'
import LineChart, { AxisDomain, LineChartColor, ReferenceLineProps } from '@lyra/ui/components/LineChart'
import Text from '@lyra/ui/components/Text'
import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Position, Trade } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo, useState } from 'react'

import fromBigNumber from '@/app/utils/fromBigNumber'
import toBigNumber from '@/app/utils/toBigNumber'

// Decrease range of chart to show liquidation
const LIQUIDATION_CHART_MULTIPLIER = 1.5

type PayoffDataPoint = {
  x: number
  payoff: number
}

type Props = {
  tradeOrPosition: Trade | Position
  onHover?: (point: PayoffDataPoint | null) => void
  showLiquidationPrice?: boolean
  color?: LineChartColor
  tooltipFontSize?: number
  compact?: boolean
  useGradientLineColor?: boolean
} & LayoutProps &
  MarginProps

const NUM_PAYOFF_CHART_POINTS = 400

export default function PayoffChart({
  tradeOrPosition,
  onHover,
  showLiquidationPrice,
  color: manualColor,
  tooltipFontSize = 12,
  useGradientLineColor = false,
  compact = false,
  ...styleProps
}: Props) {
  const isCall = tradeOrPosition.isCall
  const strikePrice = tradeOrPosition.strikePrice
  const breakEven = tradeOrPosition.breakEven()
  const currSpotPrice = tradeOrPosition.market().spotPrice
  const spotPriceAtExpiry = tradeOrPosition instanceof Position ? tradeOrPosition.spotPriceAtExpiry : null
  const spotPrice = spotPriceAtExpiry ?? currSpotPrice // use spot at expiry

  const marketName = tradeOrPosition.market().name

  const textColor = useThemeColor('secondaryText')

  const liquidationPrice = tradeOrPosition.collateral?.liquidationPrice
    ? fromBigNumber(tradeOrPosition.collateral.liquidationPrice)
    : null

  const [hoverPayoff, setHoverPayoff] = useState<number | null>(null)

  const handleHover = useCallback(
    (pt: PayoffDataPoint | null) => {
      setHoverPayoff(pt?.payoff ?? null)
      if (onHover) {
        onHover(pt)
      }
    },
    [onHover, setHoverPayoff]
  )

  const expectedPayoffAtSpot = fromBigNumber(tradeOrPosition.payoff(spotPrice))
  const expectedPayoff = hoverPayoff ?? expectedPayoffAtSpot

  const data: PayoffDataPoint[] = useMemo(() => {
    // Domain of x-axis
    const chartMax =
      isCall && liquidationPrice
        ? liquidationPrice
        : Math.max(1.25 * fromBigNumber(breakEven), 1.5 * fromBigNumber(spotPrice))
    const chartMin = !isCall && liquidationPrice ? liquidationPrice : 0
    // Asset price => x-axis
    const prices = [chartMin, fromBigNumber(strikePrice), chartMax]
    // Chart ticks
    const pointInterval = chartMax / NUM_PAYOFF_CHART_POINTS
    const interpolatedPrice: BigNumber[] = []
    for (let i = prices[0]; i < chartMax; i += pointInterval) {
      const num = toBigNumber(i)
      if (num) {
        interpolatedPrice.push(num)
      }
    }
    return interpolatedPrice.map(spotPrice => ({
      x: fromBigNumber(spotPrice),
      payoff: fromBigNumber(tradeOrPosition.payoff(spotPrice)),
    }))
  }, [isCall, liquidationPrice, breakEven, spotPrice, strikePrice, tradeOrPosition])

  const color: LineChartColor = manualColor ? manualColor : expectedPayoff >= 0 ? 'primary' : 'error'

  const isHovering = !!hoverPayoff
  const referenceLines = useMemo(() => {
    const referenceLines: ReferenceLineProps[] = []
    referenceLines.push({
      id: 'hoverSpotPrice',
      opacity: isHovering ? 0 : 1,
      x: fromBigNumber(spotPrice),
      label: ({ viewBox }: { viewBox: { x: number; y: number } }) => {
        return (
          <svg opacity={isHovering ? 0 : 1} x={viewBox.x - 50} y={tooltipFontSize} overflow="visible" width="100px">
            <style>{`
              @import url('https://rsms.me/inter/inter.css');
              text {
                font-family: "Inter var", sans-serif;
              }
            `}</style>
            <text
              x="50%"
              y={0}
              fill={textColor}
              dominantBaseline="middle"
              textAnchor="middle"
              fontFamily="Inter var"
              fontSize={tooltipFontSize}
            >
              {marketName} Price{' '}
              {tradeOrPosition instanceof Position && tradeOrPosition.spotPriceAtExpiry ? 'At Exp' : 'Now'}
            </text>
            <text
              x="50%"
              y={tooltipFontSize * 1.75}
              fill={textColor}
              dominantBaseline="middle"
              textAnchor="middle"
              fontFamily="Inter var"
              fontSize={tooltipFontSize}
            >
              {formatUSD(spotPrice)}
            </text>
          </svg>
        )
      },
    })
    if (showLiquidationPrice && liquidationPrice && data.length > 1) {
      const segment = isCall
        ? [
            { x: data[data.length - 1].x, y: LIQUIDATION_CHART_MULTIPLIER * data[data.length - 1].payoff },
            { x: data[data.length - 1].x, y: data[data.length - 1].payoff },
          ]
        : [
            { x: data[0].x, y: LIQUIDATION_CHART_MULTIPLIER * data[1].payoff },
            { x: data[0].x, y: data[1].payoff },
          ]
      referenceLines.push({
        id: 'liquidationPrice',
        stroke: color,
        strokeWidth: 2,
        strokeDasharray: '3 3',
        segment,
      })
    }
    return referenceLines
  }, [
    isHovering,
    spotPrice,
    showLiquidationPrice,
    liquidationPrice,
    data,
    tooltipFontSize,
    textColor,
    marketName,
    tradeOrPosition,
    isCall,
    color,
  ])

  const domain: AxisDomain = useMemo(
    () =>
      liquidationPrice
        ? liquidationPrice > fromBigNumber(strikePrice)
          ? ['dataMin', (dataMax: number) => dataMax * 1.01]
          : [(dataMin: number) => dataMin * 0.99, 'dataMax']
        : ['dataMin', 'dataMax'],
    [liquidationPrice, strikePrice]
  )

  return (
    <LineChart
      {...styleProps}
      chartMargin={{ top: 18 + tooltipFontSize * 2.5 }}
      type="linear"
      dataKeys={[{ label: 'Payoff', key: 'payoff' }]}
      domain={domain}
      lineColor={color}
      range={
        showLiquidationPrice && liquidationPrice
          ? [(dataMin: number) => dataMin * LIQUIDATION_CHART_MULTIPLIER, 'dataMax']
          : ['dataMin', 'dataMax']
      }
      data={data}
      onHover={handleHover}
      renderTooltip={({ x }) => (
        <Flex flexDirection="column" alignItems="center" ml="-100%">
          <Text variant="small" color="secondaryText">
            {marketName} Price at Exp
          </Text>
          <Text variant="small" color="secondaryText">
            {formatUSD(x)}
          </Text>
        </Flex>
      )}
      hideXAxis={false}
      referenceLinesProps={referenceLines}
      useGradientLineColor={useGradientLineColor}
      fallback="Something went wrong"
      compact={compact}
    />
  )
}

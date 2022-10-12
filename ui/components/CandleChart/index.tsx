import Box from '@lyra/ui/components/Box'
import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import { LayoutProps } from '@lyra/ui/types'
import formatDateTime from '@lyra/ui/utils/formatDateTime'
import formatUSD from '@lyra/ui/utils/formatUSD'
import {
  ChartOptions,
  ColorType,
  createChart,
  DeepPartial,
  LineStyle,
  LineWidth,
  OhlcData,
  PriceLineOptions,
  Range,
  Time,
  UTCTimestamp,
} from 'lightweight-charts'
import React, { useEffect, useRef } from 'react'
export type { OhlcData, Time } from 'lightweight-charts'

type Props = {
  data: OhlcData[]
  showTimeRange?: Range<Time>
  onHover?: (data: OhlcData | null) => void
} & LayoutProps

const STATIC_CHART_OPTIONS: DeepPartial<ChartOptions> = {
  grid: {
    vertLines: {
      visible: false,
    },
    horzLines: {
      visible: false,
    },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
    fixLeftEdge: true,
    fixRightEdge: true,
    borderVisible: false,
    tickMarkFormatter: (time: UTCTimestamp) => formatDateTime(time, true, true),
    barSpacing: 26,
  },
  rightPriceScale: {
    scaleMargins: {
      top: 0.1,
      bottom: 0.05,
    },
    entireTextOnly: true,
    borderVisible: false,
    drawTicks: false,
    // Hide price axis
    // visible: false,
  },
}

const _CandleChart = ({ data, onHover, showTimeRange, ...styleProps }: Props) => {
  const chartContainerRef = useRef<HTMLDivElement>()
  const background = useThemeColor('background')
  const cardNestedBg = useThemeColor('cardNestedBg')
  const primaryLine = useThemeColor('primaryLine')
  const errorLine = useThemeColor('errorLine')
  const textColor = useThemeColor('text')
  const secondaryTextColor = useThemeColor('secondaryText')
  const crosshairColor = useThemeColor('crosshair')
  const axis = useThemeColor('axis')

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart?.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    const chart = chartContainerRef.current
      ? createChart(chartContainerRef.current, {
          layout: {
            background: {
              type: ColorType.Solid,
              color: 'transparent',
            },
            textColor: secondaryTextColor,
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
          },
          width: chartContainerRef.current.clientWidth,
          crosshair: {
            vertLine: {
              color: crosshairColor,
              labelBackgroundColor: cardNestedBg,
            },
            horzLine: {
              color: crosshairColor,
            },
          },
          localization: {
            priceFormatter: (price: number) => formatUSD(price),
            timeFormatter: (time: number) => formatDateTime(time, true, true),
          },
          ...STATIC_CHART_OPTIONS,
        })
      : null
    // Add hover callback
    chart?.subscribeCrosshairMove(param => {
      if (!(param.point === undefined || !param.time || param.point.x < 0 || param.point.y < 0) && newSeries) {
        if (onHover) {
          onHover(param.seriesPrices.get(newSeries) as unknown as OhlcData)
        }
      } else {
        if (onHover) {
          onHover(null)
        }
      }
    })
    const priceLine: PriceLineOptions = {
      price: data[data.length - 1].close,
      color: axis,
      lineWidth: 1 as LineWidth,
      lineStyle: LineStyle.Solid,
      lineVisible: true,
      axisLabelVisible: false,
      title: '',
    }
    const newSeries = chart?.addCandlestickSeries({
      upColor: primaryLine,
      downColor: errorLine,
      wickUpColor: primaryLine,
      wickDownColor: errorLine,
      borderVisible: false,
      priceLineColor: background,
      priceFormat: {
        type: 'price',
      },
    })
    newSeries?.createPriceLine(priceLine)
    newSeries?.setData(data)
    if (showTimeRange) {
      chart?.timeScale().setVisibleRange(showTimeRange)
    } else {
      chart?.timeScale().fitContent()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      chart?.remove()
    }
  }, [
    background,
    axis,
    textColor,
    primaryLine,
    errorLine,
    data,
    onHover,
    cardNestedBg,
    crosshairColor,
    secondaryTextColor,
    showTimeRange,
  ])

  return <Box {...styleProps} ref={chartContainerRef} />
}

export default _CandleChart

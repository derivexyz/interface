import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import React, { ReactElement, useCallback } from 'react'
import {
  Line,
  LineChart as RechartsLineChart,
  LineProps,
  ReferenceLine,
  ReferenceLineProps as RechartsReferenceLineProps,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CategoricalChartState } from 'recharts/types/chart/generateCategoricalChart'
import { AxisDomain as RechartsAxisDomain, Margin } from 'recharts/types/util/types'
import { LayoutProps, MarginProps } from 'styled-system'

import Box from '../Box'
import Center from '../Center'
import Text from '../Text'

const DEFAULT_LINE_STROKE_WIDTH = 2
const DEFAULT_REFERENCE_LINE_STROKE_WIDTH = 1.5

export type ReferenceLineProps = RechartsReferenceLineProps & { id: string | number }
export type AxisDomain = RechartsAxisDomain

export type CustomLineChartKey<LineData> = {
  label: string
  key: keyof LineData
  opacity?: number
  strokeDasharray?: string
  activeDot?: boolean | ReactElement
}

export type DataPoint = {
  [key: string]: any
}

export type LineChartColor = 'primary' | 'error'

type Props<T extends DataPoint> = {
  domain?: AxisDomain
  range?: AxisDomain
  // Array of objects
  data: T[]
  // Descriptor for each line
  dataKeys: CustomLineChartKey<T>[]
  type: LineProps['type']
  hideXAxis?: boolean
  renderTooltip?: (payload: T) => React.ReactNode | string
  onClickArea?: (key: string) => void
  onHover?: (payload: T | null) => void
  onMouseLeave?: () => void
  referenceLinesProps?: ReferenceLineProps[]
  chartMargin?: Margin
  xAxisDataKey?: string
  lineColor?: LineChartColor
  fallback?: string
  compact?: boolean
  useGradientLineColor?: boolean
} & LayoutProps &
  MarginProps

const getStrokeColor = (lineColor: LineChartColor): string => {
  switch (lineColor) {
    case 'primary':
      return 'primaryLine'
    case 'error':
      return 'errorLine'
  }
}

const getGradientStrokeColor = (lineColor: LineChartColor): string => {
  switch (lineColor) {
    case 'primary':
      return 'url(#linear_primary)'
    case 'error':
      return 'url(#linear_error)'
  }
}

function LineChart<T extends DataPoint>({
  data,
  dataKeys,
  domain,
  range,
  hideXAxis = true,
  onHover,
  renderTooltip,
  onMouseLeave,
  referenceLinesProps,
  type,
  chartMargin = { top: 24, bottom: 8 },
  xAxisDataKey = 'x',
  lineColor = 'primary',
  useGradientLineColor = false,
  fallback = 'Not enough data',
  compact,
  ...styleProps
}: Props<T>): JSX.Element {
  const background = useThemeColor('background')
  const axisStroke = useThemeColor('axis')
  const strokeColor = useThemeColor(getStrokeColor(lineColor))
  const gradientStrokeColor = useGradientLineColor ? getGradientStrokeColor(lineColor) : 'primary'
  const handleMouseMove = useCallback(
    ({ activePayload }: CategoricalChartState) => {
      if (!activePayload || activePayload.length === 0) {
        return null
      }
      if (onHover && activePayload[0].payload) {
        onHover(activePayload[0].payload)
      }
    },
    [onHover]
  )

  if (data.length <= 1) {
    return (
      <Center {...styleProps}>
        <Text variant="secondary" color="secondaryText">
          {fallback}
        </Text>
      </Center>
    )
  }

  const compactStyleProps = compact ? { ...styleProps } : null

  const chart = (
    <RechartsLineChart
      {...(compactStyleProps as any)}
      data={data}
      margin={chartMargin}
      onMouseLeave={() => {
        if (onMouseLeave) {
          onMouseLeave()
        } else if (onHover) {
          onHover(null)
        }
      }}
      compact={compact}
      onMouseMove={handleMouseMove}
      isAnimationActive={!compact}
    >
      {hideXAxis ? null : <ReferenceLine y={0} stroke={axisStroke} strokeWidth={DEFAULT_REFERENCE_LINE_STROKE_WIDTH} />}
      <XAxis hide={true} dataKey={xAxisDataKey} type="number" domain={domain ?? ['dataMin', 'dataMax']} />
      <YAxis hide={true} type="number" domain={range ?? ['dataMin', 'dataMax']} />
      <defs>
        <linearGradient id="linear_primary" gradientUnits="userSpaceOnUse">
          <stop offset="5%" stopColor="#00FFFF" />
          <stop offset="45%" stopColor="#60DDBF" />
        </linearGradient>
        <linearGradient id="linear_error" gradientUnits="userSpaceOnUse">
          <stop offset="5%" stopColor="#FF7CB2" />
          <stop offset="45%" stopColor="#E8488A" />
        </linearGradient>
      </defs>
      {renderTooltip && !compact ? (
        <Tooltip
          cursor={{ visibility: 'default', stroke: axisStroke }}
          allowEscapeViewBox={{ x: true, y: true }}
          isAnimationActive={false}
          offset={0}
          content={prop => {
            if (prop.payload && prop.payload.length) {
              const tooltip = renderTooltip(prop.payload[0].payload)
              return typeof tooltip === 'string' ? (
                <Text variant="small" color="secondaryText" ml="-50%">
                  {tooltip}
                </Text>
              ) : (
                tooltip
              )
            }
            // Required null return
            return null
          }}
          position={{ y: 0 }}
        />
      ) : null}
      {referenceLinesProps
        ? referenceLinesProps.map(referenceLineProps => (
            <ReferenceLine
              key={referenceLineProps.id}
              {...referenceLineProps}
              stroke={axisStroke}
              strokeWidth={DEFAULT_REFERENCE_LINE_STROKE_WIDTH}
            />
          ))
        : null}
      {dataKeys.map(dataKey => {
        return (
          <Line
            key={dataKey.key.toString()}
            dataKey={dataKey.key.toString()}
            isAnimationActive={!compact}
            animationDuration={!compact ? 200 : 0}
            activeDot={dataKey.activeDot ? dataKey.activeDot : { stroke: background }}
            opacity={dataKey.opacity}
            type={type}
            strokeWidth={DEFAULT_LINE_STROKE_WIDTH}
            stroke={useGradientLineColor ? gradientStrokeColor : strokeColor}
            strokeDasharray={dataKey.strokeDasharray}
            dot={false}
          />
        )
      })}
    </RechartsLineChart>
  )

  if (compact) {
    return chart
  }

  return (
    <Box {...styleProps}>
      <ResponsiveContainer width="100%" height="100%" minWidth={undefined}>
        {chart}
      </ResponsiveContainer>
    </Box>
  )
}

export default LineChart

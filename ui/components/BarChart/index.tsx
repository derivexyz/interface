import Box from '@lyra/ui/components/Box'
import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import React from 'react'
import {
  Bar,
  BarChart as RechartsBarChart,
  ReferenceLine,
  ReferenceLineProps as RechartsReferenceLineProps,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts'
import { AxisDomain as RechartsAxisDomain, Margin } from 'recharts/types/util/types'
import { LayoutProps, MarginProps } from 'styled-system'

import Center from '../Center'
import Text from '../Text'

export type ReferenceLineProps = RechartsReferenceLineProps
export type AxisDomain = RechartsAxisDomain

export type CustomBarChartKey<BarData> = {
  label: string
  key: keyof BarData
  activeDot?: boolean | React.ReactNode
  stackId?: string
}

export type DataPoint = {
  x: number
  [key: string]: number
}

export type BarChartColor = 'primary' | 'error'

type Props<T extends DataPoint> = {
  range?: AxisDomain
  // Array of objects
  data: T[]
  // Descriptor for each bar
  dataKeys: CustomBarChartKey<T>[]
  hideXAxis?: boolean
  renderTooltip?: (payload: T) => React.ReactNode | string
  onClickArea?: (key: string) => void
  onHover?: (payload: T | null) => void
  onMouseLeave?: () => void
  referenceLinesProps?: ReferenceLineProps[]
  chartMargin?: Margin
  color?: BarChartColor
  fallback?: string
} & LayoutProps &
  MarginProps

const getFillColor = (areaColor: BarChartColor): string => {
  switch (areaColor) {
    case 'primary':
      return 'primaryLine'
    case 'error':
      return 'errorLine'
  }
}

export default function BarChart<T extends DataPoint>({
  data,
  dataKeys,
  range,
  hideXAxis = true,
  onHover,
  renderTooltip,
  onMouseLeave,
  referenceLinesProps,
  color = 'primary',
  chartMargin = { top: 24, bottom: 8, left: 16, right: 16 },
  fallback = 'Not enough data',
  ...styleProps
}: Props<T>): JSX.Element {
  const label = useThemeColor('secondaryText')
  const hover = useThemeColor('hover')
  const fillColor = useThemeColor(getFillColor(color))

  if (data.length <= 1) {
    return (
      <Center {...styleProps}>
        <Text variant="secondary" color="secondaryText">
          {fallback}
        </Text>
      </Center>
    )
  }

  return (
    <Box {...styleProps}>
      <ResponsiveContainer width="100%" height="100%" minWidth={undefined}>
        <RechartsBarChart
          data={data}
          margin={chartMargin}
          onMouseLeave={() => {
            if (onMouseLeave) {
              onMouseLeave()
            } else if (onHover) {
              onHover(null)
            }
          }}
        >
          {hideXAxis ? null : <ReferenceLine y={0} stroke={label} />}
          <YAxis hide={true} type="number" domain={range ?? ['dataMin', 'dataMax']} />
          <Tooltip
            cursor={{ visibility: 'default', stroke: hover, fill: hover }}
            allowEscapeViewBox={{ x: true, y: true }}
            isAnimationActive={false}
            offset={0}
            content={prop => {
              if (onHover && prop.payload && prop.payload.length) {
                onHover(prop.payload[0].payload)
              }
              if (renderTooltip && prop.payload && prop.payload.length) {
                const tooltip = renderTooltip(prop.payload[0].payload)
                return typeof tooltip === 'string' ? (
                  <Text variant="small" color="secondaryText" ml="-50%">
                    {tooltip}
                  </Text>
                ) : (
                  tooltip
                )
              }
              return null
            }}
            position={{ y: 0 }}
          />
          {referenceLinesProps
            ? referenceLinesProps.map(referenceLineProps => (
                <ReferenceLine key={referenceLineProps.id} {...referenceLineProps} />
              ))
            : null}
          {dataKeys.map(dataKey => {
            return (
              <Bar
                key={dataKey.key.toString()}
                dataKey={dataKey.key.toString()}
                animationDuration={300}
                fill={fillColor}
                background={false}
                stackId={dataKey.stackId}
              />
            )
          })}
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  )
}

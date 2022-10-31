import Box from '@lyra/ui/components/Box'
import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import React, { ReactElement, useCallback } from 'react'
import {
  Area,
  AreaChart as RechartsAreaChart,
  AreaProps,
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

import Center from '../Center'
import Text from '../Text'

const DEFAULT_STROKE_WIDTH = 2

export type ReferenceLineProps = RechartsReferenceLineProps
export type AxisDomain = RechartsAxisDomain

export type CustomAreaChartKey<AreaData> = {
  label: string
  key: keyof AreaData
  strokeDasharray?: string
  activeDot?: boolean | ReactElement
  stackId?: string
}

export type DataPoint = Record<string, any>

export type AreaChartColor = 'primary' | 'error'

type Props<T extends DataPoint> = {
  domain?: AxisDomain
  range?: AxisDomain
  // Array of objects
  data: T[]
  // Descriptor for each line
  dataKeys: CustomAreaChartKey<T>[]
  type: AreaProps['type']
  hideXAxis?: boolean
  renderTooltip?: (payload: T) => React.ReactNode | string
  onClickArea?: (key: string) => void
  onHover?: (payload: T | null) => void
  onMouseLeave?: () => void
  color?: AreaChartColor
  referenceLinesProps?: ReferenceLineProps[]
  chartMargin?: Margin
  xAxisDataKey?: string
  fallback?: string
} & LayoutProps &
  MarginProps

const getStrokeColor = (areaColor: AreaChartColor): string => {
  switch (areaColor) {
    case 'primary':
      return 'primaryLine'
    case 'error':
      return 'errorLine'
  }
}

const getFillColor = (areaColor: AreaChartColor): string => {
  switch (areaColor) {
    case 'primary':
      return 'primaryArea'
    case 'error':
      return 'errorArea'
  }
}

export default function AreaChart<T extends DataPoint>({
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
  color = 'primary',
  fallback = 'No available data',
  ...styleProps
}: Props<T>): JSX.Element {
  const background = useThemeColor('background')
  const label = useThemeColor('secondaryText')

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

  const strokeColor = useThemeColor(getStrokeColor(color))
  const fillColor = useThemeColor(getFillColor(color))

  if (data.length === 0) {
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
        <RechartsAreaChart
          data={data}
          margin={chartMargin}
          onMouseLeave={() => {
            if (onHover) {
              onHover(null)
            }
            if (onMouseLeave) {
              onMouseLeave()
            }
          }}
          onMouseUp={() => {
            if (onHover) {
              onHover(null)
            }
          }}
          onMouseMove={handleMouseMove}
        >
          {hideXAxis ? null : <ReferenceLine y={0} stroke={label} />}
          <XAxis hide={true} dataKey={xAxisDataKey} type="number" domain={domain ?? ['dataMin', 'dataMax']} />
          <YAxis hide={true} type="number" domain={range ?? ['dataMin', 'dataMax']} />
          {renderTooltip ? (
            <Tooltip
              cursor={{ visibility: 'default', stroke: label }}
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
                return null
              }}
              position={{ y: 0 }}
            />
          ) : null}

          {referenceLinesProps
            ? referenceLinesProps.map(referenceLineProps => (
                <ReferenceLine key={referenceLineProps.id} {...referenceLineProps} />
              ))
            : null}
          {dataKeys.map(dataKey => {
            return (
              <Area
                key={dataKey.key.toString()}
                dataKey={dataKey.key.toString()}
                animationDuration={300}
                activeDot={dataKey.activeDot ? dataKey.activeDot : { stroke: background }}
                type={type}
                strokeWidth={DEFAULT_STROKE_WIDTH}
                stroke={strokeColor}
                strokeDasharray={dataKey.strokeDasharray}
                fill={fillColor}
                fillOpacity="100%"
                dot={false}
                stackId={dataKey.stackId}
              />
            )
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </Box>
  )
}

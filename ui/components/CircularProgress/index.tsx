import Box from '@lyra/ui/components/Box'
import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import useThemeValue from '@lyra/ui/hooks/useThemeValue'
import { ResponsiveValue } from '@lyra/ui/types'
import React from 'react'
import { MarginProps } from 'styled-system'

export type CircularProgressProps = {
  outerWidth: ResponsiveValue
  innerWidth: ResponsiveValue
  progress: number
  color?: string
} & MarginProps

export type CircularProgressElement = React.ReactElement<CircularProgressProps>

export default function CircularProgress({
  outerWidth,
  innerWidth,
  progress,
  color,
  ...styleProps
}: CircularProgressProps): CircularProgressElement {
  const fill = useThemeColor(color)
  const outerRadius = parseInt(useThemeValue(outerWidth).toString()) / 2
  const innerRadius = parseInt(useThemeValue(innerWidth).toString()) / 2
  const width = parseInt(useThemeValue(outerRadius - innerRadius).toString())

  return (
    <Box width={outerRadius * 2} height={outerRadius * 2} {...styleProps}>
      <svg width={outerRadius * 2} height={outerRadius * 2} style={{ transform: 'scale(1,1) rotate(-90deg)' }}>
        <circle
          id="donut"
          cx={outerRadius}
          cy={outerRadius}
          r={innerRadius}
          strokeWidth={width}
          stroke={fill}
          fill="none"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100 * (1 - progress),
          }}
          pathLength={100}
        />
      </svg>
    </Box>
  )
}

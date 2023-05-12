import { ResponsiveValue } from '@lyra/ui/types'
import React from 'react'
import { Box } from 'rebass'
import styled from 'styled-components'
import { LayoutProps, MarginProps } from 'styled-system'

export type Props = { borderRadius?: ResponsiveValue } & LayoutProps & MarginProps

function ShimmerRaw({ width = '100%', height = '100%', borderRadius = 'text', ...styleProps }: Props) {
  return (
    <Box
      width={width}
      height={height}
      sx={{
        borderRadius,
        position: 'relative',
        overflow: 'hidden',
        bg: 'shimmerBg',
        animation: 'shimmer 2s infinite',
      }}
      {...styleProps}
    />
  )
}

const Shimmer = styled(ShimmerRaw)`
  @keyframes shimmer {
    0% {
      opacity: 40%;
    }
    50% {
      opacity: 100%;
    }
    100% {
      opacity: 40%;
    }
  }
`

export default Shimmer

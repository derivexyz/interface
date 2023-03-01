import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import { MarginProps, PaddingProps } from '@lyra/ui/types'
import React from 'react'

import Box from '../Box'

type Props = {
  progress: number
  color?: string
} & MarginProps &
  PaddingProps

export default function LinearProgress({ color = 'primaryText', progress, ...styleProps }: Props) {
  const fill = useThemeColor(color)
  return (
    <Box width="100%" height={8} bg="cardNestedBg" sx={{ borderRadius: '20px' }} {...styleProps}>
      <Box width={`${progress * 100}%`} height="100%" bg={fill} sx={{ borderRadius: '20px' }}></Box>
    </Box>
  )
}

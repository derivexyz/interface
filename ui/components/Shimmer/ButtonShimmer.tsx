import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import { ButtonSize, getButtonSizeSx } from '../Button'
import Shimmer from '.'

type Props = {
  size?: ButtonSize
  nested?: boolean
} & MarginProps &
  Omit<LayoutProps, 'height' | 'h'>

export default function ButtonShimmer({ size = 'md', width = 100, nested = false, ...styleProps }: Props) {
  const sizeSx = getButtonSizeSx(size)
  const buttonHeight = sizeSx?.minHeight
  return <Shimmer nested={nested} height={buttonHeight} width={width} borderRadius="circle" {...styleProps} />
}

import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import { ButtonSize, getButtonSizeSx } from '../Button'
import Shimmer from '.'

type Props = {
  size?: ButtonSize
} & MarginProps &
  Omit<LayoutProps, 'height' | 'h'>

export default function ButtonShimmer({ size = 'md', width = 100, ...styleProps }: Props) {
  const sizeSx = getButtonSizeSx(size)
  const buttonHeight = sizeSx?.minHeight
  return <Shimmer height={buttonHeight} width={width} borderRadius="circle" {...styleProps} />
}

import React from 'react'

import Box from '../Box'

type Props = {
  isVertical?: boolean
  isHorizontal?: boolean
}

export default function CardSeparator({ isVertical = false, isHorizontal = true }: Props) {
  return (
    <Box
      variant="cardSeparator"
      width={isVertical || !isHorizontal ? '3px' : '100%'}
      height={isVertical || !isHorizontal ? '100%' : '3px'}
    />
  )
}

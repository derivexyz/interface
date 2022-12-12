import Shimmer from '@lyra/ui/components/Shimmer'
import { TextVariant } from '@lyra/ui/components/Text'
import { MarginProps, ResponsiveValue } from '@lyra/ui/types'
import React from 'react'

import { getTokenAmountHeightForVariant } from '.'

type Props = {
  variant?: TextVariant
  width?: ResponsiveValue
} & MarginProps

export default function TokenAmountTextShimmer({ variant = 'body', width = 100, ...styleProps }: Props) {
  return (
    <Shimmer borderRadius={'text'} height={getTokenAmountHeightForVariant(variant)} width={width} {...styleProps} />
  )
}

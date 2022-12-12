import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import { ResponsiveValue } from '@rainbow-me/rainbowkit/dist/css/sprinkles.css'
import React from 'react'

import LabelItem from '.'

type Props = {
  label?: string | React.ReactNode
  value?: string | React.ReactNode
  labelWidth?: ResponsiveValue<number>
  valueWidth?: ResponsiveValue<number>
}

export default function LabelItemShimmer({ label, value, labelWidth = 80, valueWidth, ...styleProps }: Props) {
  return (
    <LabelItem
      label={label ?? <TextShimmer width={labelWidth} variant="secondary" />}
      value={value ?? <TextShimmer width={valueWidth} variant="secondary" />}
      {...styleProps}
    />
  )
}

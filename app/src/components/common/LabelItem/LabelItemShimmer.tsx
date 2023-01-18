import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import { TextVariant } from '@lyra/ui/components/Text'
import { ResponsiveValue } from '@rainbow-me/rainbowkit/dist/css/sprinkles.css'
import React from 'react'

import LabelItem from '.'

type Props = {
  label?: string | React.ReactNode
  value?: string | React.ReactNode
  valueTextVariant?: TextVariant
  labelWidth?: ResponsiveValue<number>
  valueWidth?: ResponsiveValue<number>
  noPadding?: boolean
}

export default function LabelItemShimmer({
  label,
  value,
  valueTextVariant,
  labelWidth = 80,
  valueWidth,
  noPadding,
  ...styleProps
}: Props) {
  return (
    <LabelItem
      label={label ?? <TextShimmer width={labelWidth} variant="secondary" />}
      value={value ?? <TextShimmer width={valueWidth} variant={valueTextVariant} />}
      noPadding={noPadding}
      {...styleProps}
    />
  )
}

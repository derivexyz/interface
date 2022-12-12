import Center from '@lyra/ui/components/Center'
import CircularProgress from '@lyra/ui/components/CircularProgress'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import MarketImage from '../MarketImage'

type Props = {
  marketName: string
  progress: number
  color: string
} & MarginProps

export default function MarketImageProgress({ marketName, progress, color, ...styleProps }: Props) {
  return (
    <Center sx={{ position: 'relative' }} {...styleProps}>
      <CircularProgress outerWidth={36} innerWidth={28} color={color} progress={progress} />
      <MarketImage
        sx={{ position: 'absolute', left: '8px', right: 0, bottom: 0, top: '8px' }}
        size={20}
        name={marketName}
      />
    </Center>
  )
}

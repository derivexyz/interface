import Center from '@lyra/ui/components/Center'
import CircularProgress from '@lyra/ui/components/CircularProgress'
import { MarginProps } from '@lyra/ui/types'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import MarketImage from '../MarketImage'

type Props = {
  market: Market
  progress: number
  color: string
  size?: number
} & MarginProps

export default function MarketImageProgress({ market, progress, color, size = 24, ...styleProps }: Props) {
  return (
    <Center sx={{ position: 'relative' }} {...styleProps}>
      <CircularProgress outerWidth={size + 16} innerWidth={size + 8} color={color} progress={progress} />
      <MarketImage
        sx={{ position: 'absolute', left: '8px', right: 0, bottom: 0, top: '8px' }}
        size={size}
        market={market}
      />
    </Center>
  )
}

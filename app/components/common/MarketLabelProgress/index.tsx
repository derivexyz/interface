import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import MarketImageProgress from '../MarketImageProgress'

type Props = {
  marketName: string
  progress: number
  color: string
} & MarginProps

export default function MarketLabelProgress({ marketName, progress, color, ...marginProps }: Props) {
  return (
    <Flex {...marginProps} alignItems="center">
      <MarketImageProgress marketName={marketName} progress={progress} color={color} />
      <Box ml={2}>
        <Text variant="secondaryMedium">{marketName}</Text>
      </Box>
    </Flex>
  )
}

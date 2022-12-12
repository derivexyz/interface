import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import MarketImage from '../MarketImage'

type Props = {
  marketName: string
} & MarginProps

export default function VaultLabel({ marketName, ...marginProps }: Props) {
  return (
    <Flex {...marginProps} alignItems="center">
      <MarketImage size={32} name={marketName} />
      <Box ml={2}>
        <Text variant="secondaryMedium">{marketName}</Text>
      </Box>
    </Flex>
  )
}

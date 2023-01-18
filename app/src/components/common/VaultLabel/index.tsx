import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import MarketImage from '../MarketImage'

type Props = {
  market: Market
} & MarginProps

export default function VaultLabel({ market, ...marginProps }: Props) {
  return (
    <Flex {...marginProps} alignItems="center">
      <MarketImage market={market} />
      <Box ml={2}>
        <Text variant="secondaryMedium">{market.name}</Text>
      </Box>
    </Flex>
  )
}

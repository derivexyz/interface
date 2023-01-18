import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'

import MarketImageProgress from '../MarketImageProgress'

type Props = {
  market: Market
  progress: number
  color: string
  size?: number
} & MarginProps

export default function MarketLabelProgress({ market, progress, color, size, ...marginProps }: Props) {
  return (
    <Flex {...marginProps} alignItems="center">
      <MarketImageProgress market={market} progress={progress} color={color} size={size} />
      <Box ml={2}>
        <Text variant="secondaryMedium">{market.baseToken.symbol}</Text>
        <Text variant="small" color="secondaryText">
          {getNetworkDisplayName(market.lyra.network)}
        </Text>
      </Box>
    </Flex>
  )
}

import Box from '@lyra/ui/components/Box'
import { Market } from '@lyrafinance/lyra-js'
import { Position } from '@lyrafinance/lyra-js'
import React from 'react'

import TradePositionCardContent from './TradePositionCardContent'

export const HISTORY_PAGE_SIZE = 5

type Props = { market: Market; openPositions: Position[] }

const TradePositionsCard = React.forwardRef((props: Props, ref) => {
  return (
    <Box ref={ref}>
      <TradePositionCardContent {...props} />
    </Box>
  )
})

export default TradePositionsCard

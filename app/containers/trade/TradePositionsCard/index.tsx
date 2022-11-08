import Box from '@lyra/ui/components/Box'
import React from 'react'

import TradePositionCardContent from './TradePositionCardContent'

export const HISTORY_PAGE_SIZE = 5

const TradePositionsCard = React.forwardRef((_, ref) => {
  return (
    <Box ref={ref}>
      <TradePositionCardContent />
    </Box>
  )
})

export default TradePositionsCard

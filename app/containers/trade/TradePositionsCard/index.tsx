import Box from '@lyra/ui/components/Box'
import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import React, { useState } from 'react'

import { MIN_TRADE_POSITION_CARD_HEIGHT } from '@/app/constants/layout'

import TradeEventHistoryTable from './TradeEventHistoryTable'
import TradeOpenPositionsTable from './TradeOpenPositionsTable'
import TradePositionHistoryTable from './TradePositionHistoryTable'

export const HISTORY_PAGE_SIZE = 5

type PositionTableState = 'open' | 'closed' | 'trades'

const TradePositionsCard = React.forwardRef((_, ref) => {
  const [selectedItem, setSelectedItem] = useState<PositionTableState>('open')
  return (
    <Box ref={ref}>
      <Card minHeight={MIN_TRADE_POSITION_CARD_HEIGHT}>
        <CardBody pb={0} height="100%">
          <ToggleButton
            items={[
              { id: 'open', label: 'Open' },
              { id: 'closed', label: 'Closed' },
              { id: 'trades', label: 'Trades' },
            ]}
            onChange={id => setSelectedItem(id)}
            selectedItemId={selectedItem}
          />
        </CardBody>
        {selectedItem === 'open' ? (
          <TradeOpenPositionsTable />
        ) : selectedItem === 'closed' ? (
          <TradePositionHistoryTable />
        ) : (
          <TradeEventHistoryTable />
        )}
      </Card>
    </Box>
  )
})

export default TradePositionsCard

import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import ToggleButtonItem from '@lyra/ui/components/Button/ToggleButtonItem'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import React, { useState } from 'react'

import { MIN_TRADE_POSITION_CARD_HEIGHT } from '@/app/constants/layout'
import withSuspense from '@/app/hooks/data/withSuspense'
import useOpenPositions from '@/app/hooks/position/useOpenPositions'

import TradeEventHistoryTable from './TradeEventHistoryTable'
import TradeOpenPositionsTable from './TradeOpenPositionsTable'
import TradePositionHistoryTable from './TradePositionHistoryTable'

type PositionTableState = 'open' | 'closed' | 'trades'

const TradePositionCardContent = withSuspense(() => {
  const openPositions = useOpenPositions()
  const [selectedItem, setSelectedItem] = useState<PositionTableState>('open')
  return openPositions.length > 0 ? (
    <Card minHeight={MIN_TRADE_POSITION_CARD_HEIGHT}>
      <CardBody pb={0} height="100%">
        <ToggleButton>
          {[
            { id: 'open', label: 'Open' },
            { id: 'closed', label: 'Closed' },
            { id: 'trades', label: 'Trades' },
          ].map(item => (
            <ToggleButtonItem
              key={item.id}
              id={item.id as PositionTableState}
              label={item.label}
              isSelected={selectedItem === item.id}
              onSelect={(id: PositionTableState) => setSelectedItem(id)}
            />
          ))}
        </ToggleButton>
      </CardBody>
      {selectedItem === 'open' ? (
        <TradeOpenPositionsTable />
      ) : selectedItem === 'closed' ? (
        <TradePositionHistoryTable />
      ) : (
        <TradeEventHistoryTable />
      )}
    </Card>
  ) : null
})

export default TradePositionCardContent

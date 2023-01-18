import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import ToggleButtonItem from '@lyra/ui/components/Button/ToggleButtonItem'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import React, { useState } from 'react'

import { MIN_TRADE_POSITION_CARD_HEIGHT } from '@/app/constants/layout'
import withSuspense from '@/app/hooks/data/withSuspense'
import useOpenPositions from '@/app/hooks/position/useOpenPositions'

import TradeEventHistoryTable from './TradeEventHistoryTable'
import TradeOpenPositionsTable from './TradeOpenPositionsTable'
import TradePositionHistoryTable from './TradePositionHistoryTable'

type PositionTableState = 'open' | 'closed' | 'trades'

const POSITION_TABS: { id: PositionTableState; label: string }[] = [
  { id: 'open', label: 'Open' },
  { id: 'closed', label: 'Closed' },
  { id: 'trades', label: 'Trades' },
]

const TradePositionCardContent = withSuspense(() => {
  const openPositions = useOpenPositions()
  const [selectedItem, setSelectedItem] = useState<PositionTableState>('open')
  return openPositions.length > 0 ? (
    <Card minHeight={MIN_TRADE_POSITION_CARD_HEIGHT}>
      <CardBody pb={0} height="100%">
        <Flex>
          <ToggleButton>
            {POSITION_TABS.map(item => (
              <ToggleButtonItem
                key={item.id}
                id={item.id}
                label={item.label}
                isSelected={selectedItem === item.id}
                onSelect={id => setSelectedItem(id)}
              />
            ))}
          </ToggleButton>
        </Flex>
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

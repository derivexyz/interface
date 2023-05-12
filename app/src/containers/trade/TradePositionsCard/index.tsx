import Box from '@lyra/ui/components/Box'
import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import ToggleButtonItem from '@lyra/ui/components/Button/ToggleButtonItem'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { Position } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import PositionsTable from '@/app/components/common/PositionsTable'
import { PageId } from '@/app/constants/pages'
import getPagePath from '@/app/utils/getPagePath'

import TradeEventHistoryTable from './TradeEventHistoryTable'
import TradePositionHistoryTable from './TradePositionHistoryTable'

type Props = { openPositions: Position[] }

type PositionTableState = 'closed' | 'trades' | 'open'

const POSITION_TABS: { id: PositionTableState; label: string }[] = [
  { id: 'open', label: 'Open' },
  { id: 'closed', label: 'Closed' },
  { id: 'trades', label: 'Trades' },
]

const TradePositionsCard = ({ openPositions }: Props) => {
  const [selectedItem, setSelectedItem] = useState<PositionTableState>('open')
  const navigate = useNavigate()
  return (
    <Box minHeight={[0, 300]} width="100%">
      <Card width="100%">
        <Flex px={[3, 6]} pt={[3, 6]}>
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
        {selectedItem === 'open' ? (
          <CardSection noPadding={openPositions.length > 0}>
            {openPositions.length > 0 ? (
              <PositionsTable
                positions={openPositions}
                onClick={position =>
                  navigate(
                    getPagePath({
                      page: PageId.Position,
                      network: position.lyra.network,
                      positionId: position.id,
                      marketAddressOrName: position.marketName,
                    })
                  )
                }
                pageSize={5}
              />
            ) : (
              <Text variant="small" color="secondaryText">
                You have no open positions.
              </Text>
            )}
          </CardSection>
        ) : selectedItem === 'closed' ? (
          <TradePositionHistoryTable />
        ) : (
          <TradeEventHistoryTable />
        )}
      </Card>
    </Box>
  )
}

export default TradePositionsCard

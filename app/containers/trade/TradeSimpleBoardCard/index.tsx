import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import ToggleButtonItem from '@lyra/ui/components/Button/ToggleButtonItem'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Center from '@lyra/ui/components/Center'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatDateTime from '@lyra/ui/utils/formatDateTime'
import { Board, Market, Option } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo, useState } from 'react'

import { LogEvent } from '@/app/constants/logEvents'
import logEvent from '@/app/utils/logEvent'

import TradeSimpleBoardTable from './TradeSimpleBoardTable'

type Props = {
  market: Market
  isCall: boolean
  onToggleCall: (isCall: boolean) => void
  isBuy: boolean
  onToggleBuy: (isBuy: boolean) => void
  selectedOption: Option | null
  onSelectOption: (option: Option) => void
  selectedBoard: Board | null
  onSelectBoard: (board: Board) => void
}

const TradeSimpleBoardCard = ({
  market,
  isCall,
  isBuy,
  selectedOption,
  selectedBoard,
  onSelectOption,
  onSelectBoard,
  onToggleBuy,
  onToggleCall,
}: Props) => {
  const boards = useMemo(() => market.liveBoards(), [market])
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])

  return (
    <Card>
      <CardSection flexDirection={isMobile ? 'column' : 'row'}>
        <Center my={[2, 0]}>
          <ToggleButton mr={4}>
            <ToggleButtonItem
              id={1}
              label="Buy"
              isSelected={isBuy}
              onSelect={() => {
                onToggleBuy(true)
                logEvent(LogEvent.BoardIsBuyToggle, {
                  marketName: market.name,
                  marketAddress: market.address,
                  boardId: selectedBoard?.id,
                  expiryTimestamp: selectedBoard?.expiryTimestamp,
                  isCall,
                  isBuy: true,
                })
              }}
            />
            <ToggleButtonItem
              id={0}
              label="Sell"
              isSelected={!isBuy}
              onSelect={() => {
                onToggleBuy(false)
                logEvent(LogEvent.BoardIsBuyToggle, {
                  marketName: market.name,
                  marketAddress: market.address,
                  boardId: selectedBoard?.id,
                  expiryTimestamp: selectedBoard?.expiryTimestamp,
                  isCall,
                  isBuy: false,
                })
              }}
            />
          </ToggleButton>
          <ToggleButton>
            <ToggleButtonItem
              id={1}
              label="Call"
              isSelected={isCall}
              onSelect={() => {
                onToggleCall(true)
                logEvent(LogEvent.BoardIsCallToggle, {
                  marketName: market.name,
                  marketAddress: market.address,
                  boardId: selectedBoard?.id,
                  expiryTimestamp: selectedBoard?.expiryTimestamp,
                  isBuy,
                  isCall: true,
                })
              }}
            />
            <ToggleButtonItem
              id={0}
              label="Put"
              isSelected={!isCall}
              onSelect={() => {
                onToggleCall(false)
                logEvent(LogEvent.BoardIsCallToggle, {
                  marketName: market.name,
                  marketAddress: market.address,
                  boardId: selectedBoard?.id,
                  expiryTimestamp: selectedBoard?.expiryTimestamp,
                  isBuy,
                  isCall: false,
                })
              }}
            />
          </ToggleButton>
        </Center>
        <DropdownButton
          my={[2, 0]}
          ml={[0, 'auto']}
          minWidth={isMobile ? undefined : 350}
          label={
            boards.length === 0
              ? 'No Expiries'
              : selectedBoard
              ? `Expires ${formatDateTime(selectedBoard.expiryTimestamp, true)}`
              : 'Expiry does not exist'
          }
          isOpen={isOpen}
          onClose={onClose}
          onClick={() => setIsOpen(true)}
          isDisabled={!boards.length}
        >
          {boards.map(board => (
            <DropdownButtonListItem
              key={board.id}
              isSelected={board.id === selectedBoard?.id}
              onClick={() => {
                onSelectBoard(board)
                logEvent(LogEvent.BoardExpirySelect, {
                  marketName: market.name,
                  marketAddress: market.address,
                  boardId: board.id,
                  expiryTimestamp: board.expiryTimestamp,
                  isBuy,
                  isCall,
                })
                onClose()
              }}
              label={formatDateTime(board.expiryTimestamp, true)}
            />
          ))}
        </DropdownButton>
      </CardSection>
      {isMobile ? <CardSeparator /> : null}
      {selectedBoard ? (
        <TradeSimpleBoardTable
          board={selectedBoard}
          isCall={isCall}
          isBuy={isBuy}
          onSelectOption={onSelectOption}
          selectedOption={selectedOption}
        />
      ) : null}
    </Card>
  )
}

export default TradeSimpleBoardCard

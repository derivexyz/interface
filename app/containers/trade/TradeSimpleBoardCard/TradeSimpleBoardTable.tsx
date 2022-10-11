import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { Board, Option } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import TradeBoardTableOrList from '@/app/components/trade/TradeBoardTableOrList'
import useIsGlobalPaused from '@/app/hooks/admin/useIsGlobalPaused'
import withSuspense from '@/app/hooks/data/withSuspense'
import useQuoteBoard from '@/app/hooks/market/useQuoteBoard'
import getDefaultQuoteSize from '@/app/utils/getDefaultQuoteSize'

type Props = {
  board: Board
  isCall: boolean
  isBuy: boolean
  selectedOption: Option | null
  onSelectOption: (option: Option) => void
}

const TRADE_BOARD_MIN_HEIGHT = 300

const TradeSimpleBoardTable = withSuspense(
  ({ board, isCall, isBuy, selectedOption, onSelectOption }: Props) => {
    const size = getDefaultQuoteSize(board.market().name)
    const quotes = useQuoteBoard(board, size, isCall)
    const isGlobalPaused = !!useIsGlobalPaused()

    const market = quotes.length ? quotes[0].option.market() : null
    const filteredQuotes = useMemo(
      () =>
        quotes
          .filter(quote => !quote.ask.isDisabled || !quote.bid.isDisabled)
          .filter(quote => {
            const quotedStrike = isBuy ? quote.bid : quote.ask
            if (market?.name.toLowerCase() === 'btc' && quotedStrike.strikeId === 36) {
              return false
            } else {
              return true
            }
          }),
      [quotes, isBuy, market]
    )
    if (isGlobalPaused) {
      return (
        <Center minHeight={TRADE_BOARD_MIN_HEIGHT}>
          <Text color="secondaryText">Trading is paused</Text>
        </Center>
      )
    }
    if (filteredQuotes.length === 0) {
      return (
        <Center minHeight={TRADE_BOARD_MIN_HEIGHT}>
          <Text variant="secondary" color="secondaryText">
            No strikes are available for this expiry
          </Text>
        </Center>
      )
    }
    return (
      <TradeBoardTableOrList
        quotes={filteredQuotes}
        isCall={isCall}
        isBuy={isBuy}
        selectedOption={selectedOption}
        onSelectOption={onSelectOption}
      />
    )
  },
  () => {
    return (
      <Center minHeight={TRADE_BOARD_MIN_HEIGHT}>
        <Spinner />
      </Center>
    )
  }
)

export default TradeSimpleBoardTable

import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { Board, Option } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import TradeBoardNoticeSection from '@/app/components/trade/TradeBoardNoticeSection'
import TradeBoardTableOrList from '@/app/components/trade/TradeBoardTableOrList'
import useIsGlobalPaused from '@/app/hooks/admin/useIsGlobalPaused'
import withSuspense from '@/app/hooks/data/withSuspense'
import useBoardQuotesSync from '@/app/hooks/market/useBoardQuotesSync'
import useMarketLiquidity from '@/app/hooks/market/useMarketLiquidity'
import fromBigNumber from '@/app/utils/fromBigNumber'
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
    const isGlobalPaused = !!useIsGlobalPaused()
    const boardQuotes = useBoardQuotesSync(board, size)
    const marketLiquidity = useMarketLiquidity(board.market().address)
    const optionQuotes = useMemo(
      () =>
        boardQuotes
          .map(({ strike, callBid, callAsk, putBid, putAsk }) => {
            const bid = isCall ? callBid : putBid
            const ask = isCall ? callAsk : putAsk
            const option = strike.option(isCall)
            return {
              bid,
              ask,
              option,
              strikePrice: fromBigNumber(strike.strikePrice),
            }
          })
          .filter(({ bid, ask }) => !!bid || !!ask)
          .sort((a, b) => a.strikePrice - b.strikePrice),
      [boardQuotes, isCall]
    )
    const isMobile = useIsMobile()
    return (
      <>
        <TradeBoardNoticeSection
          mt={isMobile ? 6 : 0}
          mx={6}
          mb={6}
          board={board}
          isGlobalPaused={isGlobalPaused}
          quotes={optionQuotes}
          marketLiquidity={marketLiquidity}
        />
        <TradeBoardTableOrList
          board={board}
          quotes={optionQuotes}
          isBuy={isBuy}
          selectedOption={selectedOption}
          onSelectOption={onSelectOption}
        />
      </>
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

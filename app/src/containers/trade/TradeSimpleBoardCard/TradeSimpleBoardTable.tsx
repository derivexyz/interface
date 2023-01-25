import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { Board, Option } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import TradeBoardNoticeSection from '@/app/components/trade/TradeBoardNoticeSection'
import TradeBoardTableOrList from '@/app/components/trade/TradeBoardTableOrList'
import useBoardQuotesSync from '@/app/hooks/market/useBoardQuotesSync'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getDefaultQuoteSize from '@/app/utils/getDefaultQuoteSize'

type Props = {
  board: Board
  isCall: boolean
  isBuy: boolean
  selectedOption: Option | null
  onSelectOption: (option: Option) => void
}

const TradeSimpleBoardTable = ({ board, isCall, isBuy, selectedOption, onSelectOption }: Props) => {
  const market = board.market()
  const size = getDefaultQuoteSize(market.name)
  const boardQuotes = useBoardQuotesSync(board, size)
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
      <TradeBoardNoticeSection mt={isMobile ? 6 : 0} mx={6} mb={6} board={board} quotes={optionQuotes} />
      <TradeBoardTableOrList
        board={board}
        quotes={optionQuotes}
        isBuy={isBuy}
        selectedOption={selectedOption}
        onSelectOption={onSelectOption}
      />
    </>
  )
}

export default TradeSimpleBoardTable

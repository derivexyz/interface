import { BigNumber } from '@ethersproject/bignumber'
import { Board } from '@lyrafinance/lyra-js'
import { useMemo } from 'react'

import { ITERATIONS, StrikeQuotesNullable } from '@/app/constants/contracts'
import getIsQuoteHidden from '@/app/utils/getIsQuoteHidden'

export default function useBoardQuotesSync(board: Board, size: BigNumber): StrikeQuotesNullable[] {
  return useMemo(
    () =>
      board
        .quoteAllSync(size, { iterations: ITERATIONS })
        .strikes.map(({ callBid, callAsk, putBid, putAsk, strike }) => {
          const hideCallBid = callBid.disabledReason
            ? getIsQuoteHidden(callBid.disabledReason) || callBid.premium.isZero()
            : false
          const hideCallAsk = callAsk.disabledReason
            ? getIsQuoteHidden(callAsk.disabledReason) || callAsk.premium.isZero()
            : false
          const hidePutBid = putBid.disabledReason
            ? getIsQuoteHidden(putBid.disabledReason) || putBid.premium.isZero()
            : false
          const hidePutAsk = putAsk.disabledReason
            ? getIsQuoteHidden(putAsk.disabledReason) || putAsk.premium.isZero()
            : false
          return {
            callBid: !hideCallBid ? callBid : null,
            callAsk: !hideCallAsk ? callAsk : null,
            putBid: !hidePutBid ? putBid : null,
            putAsk: !hidePutAsk ? putAsk : null,
            strike,
          }
        }),
    [board, size]
  )
}

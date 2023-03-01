import { Trade } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { useMutateTradeBalances } from '../account/useAccountBalances'
import { useMutateTradePageData } from '../market/useTradePageData'
import { useMutatePositionPageData } from '../position/usePositionPageData'

export default function useMutateTrade(trade: Trade) {
  const mutateTradePageData = useMutateTradePageData()
  const mutatePositionPageData = useMutatePositionPageData()
  const mutateTradeBalances = useMutateTradeBalances(trade.market())
  return useCallback(async () => {
    await Promise.all([mutateTradePageData(), mutateTradeBalances(), mutatePositionPageData()])
  }, [mutatePositionPageData, mutateTradeBalances, mutateTradePageData])
}

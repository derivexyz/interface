import { Trade } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { useMutateAccountBalances } from '../account/useAccountBalances'
import { useMutateTradePageData } from '../market/useTradePageData'
import { useMutatePositionPageData } from '../position/usePositionPageData'

export default function useMutateTrade(trade: Trade) {
  const mutateTradePageData = useMutateTradePageData()
  const mutatePositionPageData = useMutatePositionPageData()
  const mutateAccountBalances = useMutateAccountBalances(trade.lyra.network)
  return useCallback(async () => {
    await Promise.all([mutateTradePageData(), mutateAccountBalances(), mutatePositionPageData()])
  }, [mutatePositionPageData, mutateAccountBalances, mutateTradePageData])
}

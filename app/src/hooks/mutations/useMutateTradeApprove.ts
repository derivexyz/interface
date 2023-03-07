import { Trade } from '@lyrafinance/lyra-js'
import { useCallback } from 'react'

import { useMutateAccountBalances } from '../account/useAccountBalances'

export default function useMutateTradeApprove(trade: Trade) {
  const mutateAccountBalances = useMutateAccountBalances(trade.lyra.network)
  return useCallback(async () => {
    await mutateAccountBalances()
  }, [mutateAccountBalances])
}

import { LiquidityDeposit, LiquidityWithdrawal } from '@lyrafinance/lyra-js'

import { ZERO_BN } from '../constants/bn'
import { VaultHistory } from '../hooks/vaults/useVaultsHistory'
import fromBigNumber from './fromBigNumber'

export const getVaultsHistoryCSV = (events: VaultHistory) => {
  const headers = [
    { label: 'Date Time', key: 'datetime' },
    { label: 'Timestamp', key: 'timestamp' },
    { label: 'Transaction Hash', key: 'transactionHash' },
    { label: 'Action', key: 'action' },
    { label: 'Value (in sUSD)', key: 'value' },
  ]

  const data = [...events.deposits, ...events.withdrawals].map(event => {
    const value = fromBigNumber(event.value ?? ZERO_BN)
    let datetime = ''
    let timestamp = 0
    let transactionHash = ''
    let action = ''
    if (event instanceof LiquidityDeposit) {
      const date = new Date(event.depositTimestamp * 1000)
      datetime = date.toISOString()
      timestamp = event.depositTimestamp
      transactionHash = event.__processed?.transactionHash ?? ''
      action = 'deposit'
    } else if (event instanceof LiquidityWithdrawal) {
      const date = new Date(event.withdrawalTimestamp * 1000)
      datetime = date.toISOString()
      timestamp = event.withdrawalTimestamp
      transactionHash = event.__processed?.transactionHash ?? ''
      action = 'withdraw'
    }
    return {
      datetime,
      timestamp,
      transactionHash,
      action,
      value,
    }
  })

  return {
    headers,
    data,
  }
}

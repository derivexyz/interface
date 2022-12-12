import formatDateTime from '@lyra/ui/utils/formatDateTime'
import { CollateralUpdateEvent, SettleEvent, TradeEvent } from '@lyrafinance/lyra-js'

import { ZERO_BN } from '../constants/bn'
import fromBigNumber from './fromBigNumber'

export const getTradeHistoryCSV = (events: (TradeEvent | CollateralUpdateEvent | SettleEvent)[]) => {
  const headers = [
    { label: 'Date Time', key: 'datetime' },
    { label: 'Timestamp', key: 'timestamp' },
    { label: 'Block Number', key: 'blockNumber' },
    { label: 'Transaction Hash', key: 'transactionHash' },
    { label: 'Action', key: 'action' },
    { label: 'Open Amount (in sUSD)', key: 'openAmount' },
    { label: 'Close Amount (in sUSD)', key: 'closeAmount' },
    { label: 'Settle Amount (in sUSD)', key: 'settleAmount' },
    { label: 'Insolvement Amount (in sUSD)', key: 'insolventAmount' },
  ]

  const data = events.map(event => {
    let action = ''
    let openAmount = 0
    let closeAmount = 0
    let settleAmount = 0
    let insolventAmount = 0
    if (event instanceof TradeEvent) {
      if (event.isLiquidation) {
        action = 'liquidation'
        insolventAmount = fromBigNumber(event.liquidation?.insolventAmount ?? ZERO_BN)
      } else if (event.isBuy) {
        action = 'buy'
        openAmount = fromBigNumber(event.premium) * (event.isBuy ? -1 : 1)
      } else {
        action = 'sell'
        closeAmount = fromBigNumber(event.premium) * (event.isBuy ? -1 : 1)
      }
    } else if (event instanceof SettleEvent) {
      action = 'settle'
      settleAmount = fromBigNumber(event.settlement)
    } else {
      action = 'update collateral'
    }

    return {
      datetime: formatDateTime(event.timestamp),
      timestamp: event.timestamp,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      action: action,
      openAmount: openAmount,
      closeAmount: closeAmount,
      settleAmount: settleAmount,
      insolventAmount: insolventAmount,
    }
  })

  return {
    headers,
    data,
  }
}

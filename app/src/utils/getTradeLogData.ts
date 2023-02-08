import { CollateralUpdateEvent, Trade, TradeEvent } from '@lyrafinance/lyra-js'

import fromBigNumber from './fromBigNumber'
import { LogData } from './logEvent'

export default function getTradeLogData(trade: Trade | TradeEvent | CollateralUpdateEvent): LogData {
  return {
    marketName: trade.marketName,
    expiryTimestamp: trade.expiryTimestamp,
    strikeId: trade.strikeId,
    strikePrice: fromBigNumber(trade.strikePrice),
    isCall: trade.isCall,
    isBuy: !(trade instanceof CollateralUpdateEvent) ? trade.isBuy : undefined,
    isLong: !(trade instanceof CollateralUpdateEvent) ? trade.isLong : undefined,
    isOpen: !(trade instanceof CollateralUpdateEvent) ? trade.isOpen : undefined,
    positionId: trade.positionId,
    premium: !(trade instanceof CollateralUpdateEvent) ? fromBigNumber(trade.premium) : undefined,
    fee: !(trade instanceof CollateralUpdateEvent) ? fromBigNumber(trade.fee) : undefined,
    size: !(trade instanceof CollateralUpdateEvent) ? fromBigNumber(trade.size) : undefined,
    iv: !(trade instanceof CollateralUpdateEvent) ? fromBigNumber(trade.iv) : undefined,
    slippage: trade instanceof Trade ? trade.slippage : undefined,
    setToCollateral:
      trade instanceof Trade
        ? trade.collateral?.amount
        : trade instanceof TradeEvent
        ? trade.collateralAmount
        : trade.amount,
    isBaseCollateral: trade instanceof Trade ? trade.collateral?.isBase : trade.isBaseCollateral,
    quoteAsset:
      trade instanceof Trade
        ? trade.quoteToken.address
        : trade instanceof CollateralUpdateEvent || trade instanceof TradeEvent
        ? trade.swap?.address
        : null,
  }
}

import { CollateralUpdateData } from '../collateral_update_event'
import { TradeEvent as AvalonTradeEvent } from '../contracts/avalon/typechain/OptionMarket'
import { TradeEvent as NewportTradeEvent } from '../contracts/newport/typechain/OptionMarket'
import {
  PositionUpdatedEvent as AvalonPositionUpdatedEvent,
  TransferEvent as AvalonTransferEvent,
} from '../contracts/newport/typechain/OptionToken'
import {
  PositionUpdatedEvent as NewportPositionUpdatedEvent,
  TransferEvent as NewportTransferEvent,
} from '../contracts/newport/typechain/OptionToken'
import { SettleEventData } from '../settle_event'
import { TradeEventData } from '../trade_event'
import { TransferEventData } from '../transfer_event'

export type PartialPositionUpdatedEvent = {
  address: string
  blockNumber: number
  transactionHash: string
  logIndex: number
  args: (AvalonPositionUpdatedEvent | NewportPositionUpdatedEvent)['args']
}

export type PartialTradeEvent = {
  address: string // OptionMarket
  blockNumber: number
  transactionHash: string
  logIndex: number
  args: (AvalonTradeEvent | NewportTradeEvent)['args']
}

export type PartialTransferEvent = {
  address: string
  blockNumber: number
  transactionHash: string
  logIndex: number
  args: (AvalonTransferEvent | NewportTransferEvent)['args']
}

export type PartialCollateralUpdateEventGroup = {
  collateralUpdate: PartialPositionUpdatedEvent
  trade?: PartialTradeEvent
  transfers: PartialTransferEvent[]
}

export type PartialTradeEventGroup = {
  trade: PartialTradeEvent
  collateralUpdate?: PartialPositionUpdatedEvent
  transfers: PartialTransferEvent[]
}

export type PositionEventData = {
  trades: TradeEventData[]
  collateralUpdates: CollateralUpdateData[]
  transfers: TransferEventData[]
  settle: SettleEventData | null
}

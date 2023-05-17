import Box from '@lyra/ui/components/Box'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { CollateralUpdateEvent, Position, SettleEvent, TradeEvent } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import filterNulls from '@/app/utils/filterNulls'
import fromBigNumber from '@/app/utils/fromBigNumber'
import toBigNumber from '@/app/utils/toBigNumber'

import PositionItem from '../PositionItem'

type Props = {
  events: { event: TradeEvent | CollateralUpdateEvent | SettleEvent; position: Position }[]
  onClick?: (event: TradeEvent | CollateralUpdateEvent | SettleEvent) => void
  pageSize?: number
} & MarginProps

export type TradeEventTableData = TableData<{
  position: Position
  event: TradeEvent | CollateralUpdateEvent | SettleEvent
  marketName: string
  strikePrice: number
  expiryTimestamp: number
  isCall: boolean
  timestamp: number
  premium: number
  fee: number
  pnl: number
  collateralValue: number
  collateralAmount: number
  stable?: string
  isBaseCollateral: boolean
}>

const TradeEventsTable = ({ events, onClick, pageSize = 10 }: Props) => {
  const rows: TradeEventTableData[] = useMemo(() => {
    return events.map(({ event, position }) => {
      const marketName = event.marketName
      const strikePrice = fromBigNumber(event.strikePrice)
      const isCall = event.isCall
      const expiryTimestamp = event.expiryTimestamp

      let collateralValue = 0
      let collateralAmount = 0
      let premium = 0
      let fee = 0
      const isBaseCollateral = !!event.isBaseCollateral
      const pnl = fromBigNumber(event.pnl(position))
      let stable: string | undefined
      if (event instanceof TradeEvent) {
        premium = fromBigNumber(event.premium) * (event.isBuy ? -1 : 1)
        const collateralUpdate = event.collateralUpdate()
        if (collateralUpdate) {
          collateralValue = -fromBigNumber(collateralUpdate.changeValue(position))
          collateralAmount = -fromBigNumber(collateralUpdate.changeAmount(position))
        }
        fee = fromBigNumber(event.fee)
      } else if (event instanceof CollateralUpdateEvent) {
        collateralValue = -fromBigNumber(event.changeValue(position))
        collateralAmount = -fromBigNumber(event.changeAmount(position))
      } else if (event instanceof SettleEvent) {
        if (!event.isLong) {
          collateralAmount = fromBigNumber(event.returnedCollateralAmount)
          collateralValue = fromBigNumber(event.returnedCollateralValue)
        } else {
          premium = fromBigNumber(event.settlement)
        }
      }

      return {
        event,
        position,
        timestamp: event.timestamp,
        marketName,
        strikePrice,
        expiryTimestamp,
        isCall,
        premium,
        fee,
        collateralAmount,
        collateralValue,
        isBaseCollateral,
        pnl,
        stable,
        onClick: onClick ? () => onClick(event) : undefined,
      }
    })
  }, [events, onClick])

  const columns = useMemo<TableColumn<TradeEventTableData>[]>(() => {
    return filterNulls([
      {
        accessor: 'timestamp',
        Header: 'Time',
        width: 65,
        Cell: (props: TableCellProps<TradeEventTableData>) => {
          const delta = Date.now() / 1000 - props.cell.value
          return <Text color="secondaryText">{formatTruncatedDuration(delta)}</Text>
        },
      },
      {
        accessor: 'expiryTimestamp',
        Header: 'Option',
        width: 220,
        Cell: (props: TableCellProps<TradeEventTableData>) => {
          const { position } = props.row.original
          return <PositionItem position={position} hideSize />
        },
      },
      {
        canSort: false,
        Header: 'Action',
        Cell: (props: TableCellProps<TradeEventTableData>) => {
          const event = props.row.original.event
          return (
            <Text
              color={
                event instanceof TradeEvent
                  ? event.isLiquidation
                    ? 'errorText'
                    : event.isBuy
                    ? 'primaryText'
                    : 'errorText'
                  : event instanceof CollateralUpdateEvent
                  ? 'text'
                  : event.isInTheMoney
                  ? 'primaryText'
                  : 'errorText'
              }
            >{`${
              event instanceof TradeEvent
                ? event.isLiquidation
                  ? 'Liquidate'
                  : event.isBuy
                  ? 'Buy'
                  : 'Sell'
                : event instanceof CollateralUpdateEvent
                ? 'Update'
                : event.isInTheMoney
                ? 'Settle'
                : 'Expire'
            }${
              event instanceof TradeEvent || event instanceof SettleEvent ? ` ${formatNumber(event.size)}` : ''
            }`}</Text>
          )
        },
      },
      {
        accessor: 'premium',
        Header: 'Premiums',
        Cell: (props: TableCellProps<TradeEventTableData>) => {
          const { position } = props.row.original
          const market = position.market()
          return (
            <Box>
              <Text color={props.cell.value ? 'text' : 'secondaryText'}>
                {props.cell.value
                  ? formatBalance(
                      { amount: props.cell.value, symbol: market.quoteToken.symbol, decimals: 18 },
                      { showSign: true, showDollars: true }
                    )
                  : '-'}
              </Text>
            </Box>
          )
        },
      },
      {
        accessor: 'collateralAmount',
        Header: 'Collateral',
        Cell: (props: TableCellProps<TradeEventTableData>) => {
          const { position, isBaseCollateral, collateralAmount } = props.row.original
          const market = position.market()
          return (
            <Text color={collateralAmount ? 'text' : 'secondaryText'}>
              {collateralAmount
                ? `${formatBalance(
                    {
                      amount: toBigNumber(collateralAmount),
                      symbol: isBaseCollateral ? market.baseToken.symbol : market.quoteToken.symbol,
                      decimals: 18,
                    },
                    { showSign: true }
                  )}`
                : '-'}
            </Text>
          )
        },
      },
      {
        accessor: 'pnl',
        Header: 'Profit / Loss',
        Cell: (props: TableCellProps<TradeEventTableData>) => {
          return (
            <Text
              color={props.cell.value === 0 ? 'secondaryText' : props.cell.value >= 0 ? 'primaryText' : 'errorText'}
            >
              {props.cell.value === 0 ? '-' : formatUSD(props.cell.value, { showSign: true })}
            </Text>
          )
        },
      },
    ])
  }, [])

  if (rows.length === 0) {
    return null
  }

  return <Table width="100%" data={rows} columns={columns} pageSize={pageSize} />
}

export default TradeEventsTable

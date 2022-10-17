import Box from '@lyra/ui/components/Box'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import Token from '@lyra/ui/components/Token'
import { MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { CollateralUpdateEvent, Position, SettleEvent, TradeEvent } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import filterNulls from '@/app/utils/filterNulls'
import fromBigNumber from '@/app/utils/fromBigNumber'

import PositionItem from '../PositionItem'

type Props = {
  events: { event: TradeEvent | CollateralUpdateEvent | SettleEvent; position: Position }[]
  onClick?: (event: TradeEvent | CollateralUpdateEvent | SettleEvent) => void
  hideOption?: boolean
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
  pnl: number
  collateralValue: number
  collateralAmount: number
  stable?: string
  isBaseCollateral: boolean
}>

const TradeEventsTable = ({ events, onClick, hideOption, pageSize = 10 }: Props) => {
  const rows: TradeEventTableData[] = useMemo(() => {
    return events.map(({ event, position }) => {
      const marketName = event.marketName
      const strikePrice = fromBigNumber(event.strikePrice)
      const isCall = event.isCall
      const expiryTimestamp = event.expiryTimestamp

      let collateralValue = 0
      let collateralAmount = 0
      let premium = 0
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
          return (
            <Text variant="secondary" color="secondaryText">
              {formatTruncatedDuration(delta)}
            </Text>
          )
        },
      },
      !hideOption
        ? {
            accessor: 'expiryTimestamp',
            Header: 'Option',
            width: 220,
            Cell: (props: TableCellProps<TradeEventTableData>) => {
              const { position } = props.row.original
              return <PositionItem position={position} hideSize />
            },
          }
        : null,
      {
        canSort: false,
        Header: 'Action',
        width: 150,
        Cell: (props: TableCellProps<TradeEventTableData>) => {
          const event = props.row.original.event
          return (
            <Token
              label={`${
                event instanceof TradeEvent
                  ? event.isLiquidation
                    ? 'Liquidation'
                    : event.isBuy
                    ? 'Bought'
                    : 'Sold'
                  : event instanceof CollateralUpdateEvent
                  ? 'Update'
                  : event.isInTheMoney
                  ? 'Settle'
                  : 'Expired'
              }${event instanceof TradeEvent || event instanceof SettleEvent ? ` ${formatNumber(event.size)}` : ''}`}
              variant={
                event instanceof TradeEvent
                  ? event.isLiquidation
                    ? 'warning'
                    : event.isBuy
                    ? 'primary'
                    : 'error'
                  : event instanceof CollateralUpdateEvent
                  ? 'default'
                  : event.isInTheMoney
                  ? 'warning'
                  : 'error'
              }
            />
          )
        },
      },
      {
        accessor: 'collateralValue',
        Header: 'Collateral',
        width: 150,
        Cell: (props: TableCellProps<TradeEventTableData>) => {
          const { isBaseCollateral, event, collateralAmount, collateralValue } = props.row.original
          if (isBaseCollateral) {
            return (
              <Box>
                <Text variant="secondary" color={collateralAmount === 0 ? 'secondaryText' : 'text'}>
                  {collateralAmount === 0 ? '-' : `${formatNumber(collateralAmount)} s${event.marketName}`}
                </Text>
                {collateralValue !== 0 ? (
                  <Text variant="small" color="secondaryText">
                    {formatUSD(collateralValue, { showSign: true })}
                  </Text>
                ) : null}
              </Box>
            )
          } else {
            return (
              <Text variant="secondary" color={props.cell.value === 0 ? 'secondaryText' : 'text'}>
                {props.cell.value === 0 ? '-' : formatUSD(props.cell.value, { showSign: true })}
              </Text>
            )
          }
        },
      },
      {
        accessor: 'premium',
        Header: 'Premiums',
        width: 150,
        Cell: (props: TableCellProps<TradeEventTableData>) => (
          <Text variant="secondary" color={props.cell.value === 0 ? 'secondaryText' : 'text'}>
            {props.cell.value === 0 ? '-' : formatUSD(props.cell.value, { showSign: true })}
          </Text>
        ),
      },
      {
        accessor: 'pnl',
        Header: 'Profit / Loss',
        width: 150,
        Cell: (props: TableCellProps<TradeEventTableData>) => {
          return (
            <Text
              variant="secondary"
              color={props.cell.value === 0 ? 'secondaryText' : props.cell.value >= 0 ? 'primaryText' : 'errorText'}
            >
              {props.cell.value === 0 ? '-' : formatUSD(props.cell.value, { showSign: true })}
            </Text>
          )
        },
      },
    ])
  }, [hideOption])

  if (rows.length === 0) {
    return null
  }

  return <Table width="100%" data={rows} columns={columns} pageSize={pageSize} />
}

export default TradeEventsTable

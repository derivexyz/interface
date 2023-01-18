import Box from '@lyra/ui/components/Box'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Position } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import filterNulls from '@/app/utils/filterNulls'
import fromBigNumber from '@/app/utils/fromBigNumber'

import PositionItem from '../PositionItem'
import PositionStatusToken from '../PositionStatusToken'

type Props = {
  positions: Position[]
  onClick?: (position: Position) => void
  pageSize?: number
} & MarginProps

export type PositionTableData = TableData<{
  position: Position
  lastUpdatedTimestamp: number
  expiryTimestamp: number
  openPrice: number
  openSpotPrice: number
  closePrice: number
  closeSpotPrice: number
  pnl: number
  pnlPercentage: number
}>

const PositionHistoryTable = ({ positions, onClick, pageSize, ...styleProps }: Props) => {
  const rows: PositionTableData[] = useMemo(
    () =>
      positions.map(position => {
        const { realizedPnl, realizedPnlPercentage, settlementPnl, settlementPnlPercentage } = position.pnl()

        const pnl = position.isSettled ? settlementPnl : realizedPnl
        const pnlPercentage = position.isSettled ? settlementPnlPercentage : realizedPnlPercentage

        const firstTrade = position.firstTrade()
        const lastTrade = position.lastTrade()
        const lastUpdatedTimestamp = position.isSettled ? position.expiryTimestamp : lastTrade?.timestamp ?? 0

        return {
          position,
          lastUpdatedTimestamp,
          expiryTimestamp: position.expiryTimestamp,
          openPrice: fromBigNumber(position.averageCostPerOption()),
          openSpotPrice: fromBigNumber(firstTrade?.spotPrice ?? ZERO_BN),
          closePrice: position.isSettled ? 0 : fromBigNumber(lastTrade?.pricePerOption ?? ZERO_BN),
          closeSpotPrice: fromBigNumber(
            position.isSettled ? position.spotPriceAtExpiry ?? ZERO_BN : lastTrade?.spotPrice ?? ZERO_BN
          ),
          pnl: fromBigNumber(pnl),
          pnlPercentage: fromBigNumber(pnlPercentage),
          onClick: onClick ? () => onClick(position) : undefined,
        }
      }),
    [positions, onClick]
  )

  const columns = useMemo<TableColumn<PositionTableData>[]>(() => {
    return filterNulls([
      {
        accessor: 'lastUpdatedTimestamp',
        Header: 'Time',
        width: 65,
        Cell: (props: TableCellProps<PositionTableData>) => {
          const now = props.row.original.position.market().block.timestamp
          return (
            <Text variant="secondary" color="secondaryText">
              {formatTruncatedDuration(now - props.cell.value)}
            </Text>
          )
        },
      },
      {
        accessor: 'expiryTimestamp',
        Header: 'Position',
        width: 220,
        Cell: (props: TableCellProps<PositionTableData>) => {
          const { position } = props.row.original
          const size = position.isSettled ? position.size : position.sizeBeforeClose()
          return <PositionItem position={position} customSize={size} />
        },
      },
      {
        accessor: 'id',
        Header: 'Status',
        width: 150,
        Cell: (props: TableCellProps<PositionTableData>) => {
          const { position } = props.row.original
          return <PositionStatusToken position={position} />
        },
      },
      {
        accessor: 'openPrice',
        Header: 'Open Price',
        width: 150,
        Cell: (props: TableCellProps<PositionTableData>) => {
          const { position, openSpotPrice } = props.row.original
          return (
            <Box>
              <Text variant="secondary">{formatUSD(props.cell.value)}</Text>
              <Text variant="small" color="secondaryText">
                {formatUSD(openSpotPrice)} / {position.market().baseToken.symbol}
              </Text>
            </Box>
          )
        },
      },
      {
        accessor: 'closePrice',
        Header: 'Close Price',
        width: 150,
        Cell: (props: TableCellProps<PositionTableData>) => {
          const { position, closeSpotPrice } = props.row.original
          return (
            <Box>
              <Text variant="secondary">{position.isSettled ? '-' : formatUSD(props.cell.value)}</Text>
              <Text variant="small" color="secondaryText">
                {formatUSD(closeSpotPrice)} / {position.market().baseToken.symbol}
              </Text>
            </Box>
          )
        },
      },
      {
        accessor: 'pnl',
        Header: 'Profit / Loss',
        width: 150,
        Cell: (props: TableCellProps<PositionTableData>) => {
          const { pnlPercentage } = props.row.original
          return (
            <Box>
              <Text variant="secondary" color={pnlPercentage > 0 ? 'primaryText' : 'errorText'}>
                {formatUSD(props.cell.value, { showSign: true })}
              </Text>
              <Text variant="small" color="secondaryText">
                {formatPercentage(pnlPercentage, true)}
              </Text>
            </Box>
          )
        },
      },
    ])
  }, [])

  if (rows.length === 0) {
    return null
  }

  return <Table data={rows} columns={columns} pageSize={pageSize} {...styleProps} />
}

export default PositionHistoryTable

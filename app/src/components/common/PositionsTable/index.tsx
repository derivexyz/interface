import Box from '@lyra/ui/components/Box'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Position } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import { UNIT, ZERO_BN } from '@/app/constants/bn'
import filterNulls from '@/app/utils/filterNulls'
import fromBigNumber from '@/app/utils/fromBigNumber'

import PositionItem from '../PositionItem'

type Props = {
  positions: Position[]
  onClick?: (position: Position) => void
  pageSize?: number
} & MarginProps

export type PositionTableData = TableData<{
  position: Position
  lastUpdatedTimestamp: number
  expiryTimestamp: number
  equity: number
  pricePerOption: number
  averageCostPerOption: number
  pnl: number
  pnlPercentage: number
}>

const PositionsTable = ({ positions, onClick, pageSize, ...styleProps }: Props) => {
  const rows: PositionTableData[] = useMemo(
    () =>
      positions.map(position => {
        const {
          realizedPnl,
          realizedPnlPercentage,
          settlementPnl,
          settlementPnlPercentage,
          unrealizedPnl,
          unrealizedPnlPercentage,
        } = position.pnl()

        const pnl = position.isOpen ? unrealizedPnl : position.isSettled ? settlementPnl : realizedPnl
        const pnlPercentage = position.isOpen
          ? unrealizedPnlPercentage
          : position.isSettled
          ? settlementPnlPercentage
          : realizedPnlPercentage

        const lastTrade = position.lastTrade()
        const lastUpdatedTimestamp = position.isSettled ? position.expiryTimestamp : lastTrade?.timestamp ?? 0

        return {
          position,
          lastUpdatedTimestamp,
          expiryTimestamp: position.expiryTimestamp,
          equity: fromBigNumber(
            position.isLong
              ? position.pricePerOption.mul(position.size).div(UNIT)
              : position.collateral?.value ?? ZERO_BN
          ),
          pricePerOption: fromBigNumber(position.pricePerOption),
          averageCostPerOption: fromBigNumber(position.averageCostPerOption()),
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
        accessor: 'expiryTimestamp',
        Header: 'Position',
        width: 220,
        Cell: (props: TableCellProps<PositionTableData>) => {
          const { position } = props.row.original
          return <PositionItem position={position} />
        },
      },
      {
        accessor: 'equity',
        Header: 'Equity',
        width: 150,
        Cell: (props: TableCellProps<PositionTableData>) => {
          const equity = props.cell.value
          const { position } = props.row.original
          const { liquidationPrice, isBase } = position.collateral ?? {}
          return (
            <Box>
              <Text variant="secondary">{equity === 0 ? '-' : formatTruncatedUSD(equity)}</Text>
              {isBase || liquidationPrice ? (
                <Text variant="small" color="secondaryText">
                  {liquidationPrice ? `Liq ${formatTruncatedUSD(liquidationPrice)}` : null}
                  {liquidationPrice && isBase ? ' · ' : ''}
                  {isBase
                    ? `${formatTruncatedNumber(position.collateral?.amount ?? ZERO_BN)} s${position.marketName}`
                    : ''}
                </Text>
              ) : null}
            </Box>
          )
        },
      },
      {
        accessor: 'averageCostPerOption',
        Header: 'Average Cost',
        width: 150,
        Cell: (props: TableCellProps<PositionTableData>) => {
          return <Text variant="secondary">{props.cell.value === 0 ? '-' : formatUSD(props.cell.value)}</Text>
        },
      },
      {
        accessor: 'pricePerOption',
        Header: 'Current Price',
        width: 150,
        Cell: (props: TableCellProps<PositionTableData>) => {
          return <Text variant="secondary">{props.cell.value === 0 ? '-' : formatUSD(props.cell.value)}</Text>
        },
      },
      {
        accessor: 'pnl',
        Header: 'Profit / Loss',
        width: 150,
        Cell: (props: TableCellProps<PositionTableData>) => {
          const { equity, pnlPercentage } = props.row.original
          if (equity === 0) {
            return <Text variant="secondary">-</Text>
          }
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

export default PositionsTable

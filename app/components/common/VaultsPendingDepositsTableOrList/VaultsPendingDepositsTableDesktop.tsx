import Table, { TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import formatDateTime from '@lyra/ui/utils/formatDateTime'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { LiquidityDelayReason } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'
import { CellProps as TableCellProps, Column as TableColum } from 'react-table'

import fromBigNumber from '@/app/utils/fromBigNumber'

import MarketLabelProgress from '../MarketLabelProgress'
import VaultsCircuitBreakerToken from '../VaultsCircuitBreakerToken'
import { VaultsPendingDepositsTableOrListProps } from '.'

type VaultsPendingDepositsTableData = TableData<{
  market: string
  value: number
  requestedDate: number
  timeToEntry: number
  delayReason: LiquidityDelayReason | null
  timeToEntryPercentage: number
}>

const VaultsDepositsTableDesktop = ({ deposits, onClick, ...styleProps }: VaultsPendingDepositsTableOrListProps) => {
  const rows: VaultsPendingDepositsTableData[] = useMemo(() => {
    return deposits.map(deposit => {
      const currentTimestamp = Math.floor(Date.now() / 1000)
      const duration = deposit.__market.depositDelay
      const startTimestamp = deposit.depositRequestedTimestamp
      const progressDuration = Math.min(Math.max(currentTimestamp - startTimestamp, 0), duration)
      const progressPct = duration > 0 ? progressDuration / duration : 0
      const timeToEntry = duration - progressDuration
      const delayReason = deposit.delayReason
      return {
        market: deposit.market().name,
        value: fromBigNumber(deposit.value),
        requestedDate: deposit.depositTimestamp,
        timeToEntry,
        timeToEntryPercentage: progressPct,
        delayReason,
        onClick: onClick ? () => onClick(deposit) : undefined,
      }
    })
  }, [deposits, onClick])
  const columns = useMemo<TableColum<VaultsPendingDepositsTableData>[]>(() => {
    const columns: TableColum<VaultsPendingDepositsTableData>[] = [
      {
        accessor: 'market',
        Header: 'Market',
        Cell: (props: TableCellProps<VaultsPendingDepositsTableData>) => {
          const { timeToEntryPercentage } = props.row.original
          return (
            <MarketLabelProgress marketName={props.cell.value} progress={timeToEntryPercentage} color="primaryText" />
          )
        },
      },
      {
        accessor: 'value',
        Header: 'Depositing',
        Cell: (props: TableCellProps<VaultsPendingDepositsTableData>) => {
          return <Text variant="secondary">{formatUSD(props.cell.value)}</Text>
        },
      },
      {
        accessor: 'requestedDate',
        Header: 'Request Date',
        Cell: (props: TableCellProps<VaultsPendingDepositsTableData>) => {
          return <Text variant="secondary">{formatDateTime(props.cell.value, true)}</Text>
        },
      },
      {
        accessor: 'timeToEntry',
        Header: 'Time to Entry',
        Cell: (props: TableCellProps<VaultsPendingDepositsTableData>) => {
          const showDuration = props.cell.value > 0
          const delayReason = props.row.original.delayReason
          return (
            <>
              {showDuration && !delayReason ? (
                <Text variant="secondary">{formatTruncatedDuration(props.cell.value)}</Text>
              ) : null}
              {delayReason ? <VaultsCircuitBreakerToken delayReason={delayReason} /> : null}
            </>
          )
        },
      },
    ]
    return columns
  }, [])
  return <Table width="100%" data={rows} columns={columns} {...styleProps} />
}

export default VaultsDepositsTableDesktop

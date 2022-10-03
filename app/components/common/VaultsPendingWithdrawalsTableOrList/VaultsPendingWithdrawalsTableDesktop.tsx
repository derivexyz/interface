import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import formatDateTime from '@lyra/ui/utils/formatDateTime'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import { LiquidityDelayReason } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import fromBigNumber from '@/app/utils/fromBigNumber'

import MarketLabelProgress from '../MarketLabelProgress'
import VaultsCircuitBreakerToken from '../VaultsCircuitBreakerToken'
import { VaultsPendingWithdrawalsTableOrListProps } from '.'

type VaultsPendingWithdrawalsTableData = TableData<{
  market: string
  balance: number
  requestedDate: number
  timeToExit: number
  timeToExitPercentage: number
  delayReason: LiquidityDelayReason | null
}>

const VaultsWithdrawalsTableDesktop = ({
  withdrawals,
  onClick,
  ...styleProps
}: VaultsPendingWithdrawalsTableOrListProps) => {
  const rows: VaultsPendingWithdrawalsTableData[] = useMemo(() => {
    return withdrawals.map(withdrawal => {
      const market = withdrawal.market()
      const currentTimestamp = Math.floor(Date.now() / 1000)
      const duration = withdrawal.__market.withdrawalDelay
      const startTimestamp = withdrawal.withdrawalRequestedTimestamp
      const progressDuration = Math.min(Math.max(currentTimestamp - startTimestamp, 0), duration)
      const progressPct = duration > 0 ? progressDuration / duration : 0
      const timeToExit = duration - progressDuration
      const delayReason = withdrawal.delayReason
      return {
        market: market.name,
        delayReason,
        balance: fromBigNumber(withdrawal.balance),
        requestedDate: withdrawal.withdrawalTimestamp,
        timeToExit,
        timeToExitPercentage: progressPct,
        onClick: onClick ? () => onClick(withdrawal) : undefined,
      }
    })
  }, [withdrawals, onClick])
  const columns = useMemo<TableColumn<VaultsPendingWithdrawalsTableData>[]>(() => {
    const columns: TableColumn<VaultsPendingWithdrawalsTableData>[] = [
      {
        accessor: 'market',
        Header: 'Market',
        Cell: (props: TableCellProps<VaultsPendingWithdrawalsTableData>) => {
          const { timeToExitPercentage } = props.row.original
          return <MarketLabelProgress marketName={props.cell.value} progress={timeToExitPercentage} color="error" />
        },
      },
      {
        accessor: 'balance',
        Header: 'Withdrawing',
        Cell: (props: TableCellProps<VaultsPendingWithdrawalsTableData>) => {
          return <Text variant="secondary">{formatNumber(props.cell.value)} Tokens</Text>
        },
      },
      {
        accessor: 'requestedDate',
        Header: 'Request Date',
        Cell: (props: TableCellProps<VaultsPendingWithdrawalsTableData>) => {
          return <Text variant="secondary">{formatDateTime(props.cell.value, true)}</Text>
        },
      },
      {
        accessor: 'timeToExit',
        Header: 'Time to Exit',
        Cell: (props: TableCellProps<VaultsPendingWithdrawalsTableData>) => {
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

export default VaultsWithdrawalsTableDesktop

import Box from '@lyra/ui/components/Box'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import formatDateTime from '@lyra/ui/utils/formatDateTime'
import formatDuration from '@lyra/ui/utils/formatDuration'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { LiquidityDelayReason, Network } from '@lyrafinance/lyra-js'
import { Market } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import fromBigNumber from '@/app/utils/fromBigNumber'

import MarketLabelProgress from '../MarketLabelProgress'
import VaultsCircuitBreakerToken from '../VaultsCircuitBreakerToken'
import { VaultsPendingWithdrawalsTableOrListProps } from '.'

type VaultsPendingWithdrawalsTableData = TableData<{
  market: Market
  baseTokenSymbol: string
  network: Network
  balance: number
  requestedDate: number
  timeToExit: number
  timeToExitPercentage: number
  delayReason: LiquidityDelayReason | null
  vaultQuoteSymbol: string
}>

const VaultsPendingWithdrawalsTableDesktop = ({
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
      const baseTokenSymbol = market.baseToken.symbol
      const network = market.lyra.network
      return {
        market: market,
        baseTokenSymbol: baseTokenSymbol,
        network: network,
        delayReason,
        balance: fromBigNumber(withdrawal.balance),
        requestedDate: startTimestamp,
        vaultQuoteSymbol: withdrawal.market().quoteToken.symbol,
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
        Header: 'Vault',
        Cell: (props: TableCellProps<VaultsPendingWithdrawalsTableData>) => {
          const { timeToExitPercentage, market } = props.row.original
          return <MarketLabelProgress market={market} progress={timeToExitPercentage} color="errorText" size={30} />
        },
      },
      {
        accessor: 'balance',
        Header: 'Withdrawing',
        Cell: (props: TableCellProps<VaultsPendingWithdrawalsTableData>) => {
          const { market } = props.row.original
          return (
            <Box>
              <Text variant={'secondary'}>{formatNumber(props.cell.value, { minDps: 1 })}</Text>
              <Text variant="small" color="secondaryText">
                {market.liquidityToken.symbol}
              </Text>
            </Box>
          )
        },
      },
      {
        accessor: 'requestedDate',
        Header: 'Requested',
        Cell: (props: TableCellProps<VaultsPendingWithdrawalsTableData>) => {
          return (
            <Text variant="secondary">
              {formatDateTime(props.cell.value, { hideYear: true, hideMins: false, includeTimezone: true })}
            </Text>
          )
        },
      },
      {
        accessor: 'timeToExit',
        Header: 'Time to Withdraw',
        Cell: (props: TableCellProps<VaultsPendingWithdrawalsTableData>) => {
          const delayReason = props.row.original.delayReason
          return (
            <>
              {!delayReason ? (
                <Text variant="secondary">{formatDuration(props.cell.value)}</Text>
              ) : (
                <VaultsCircuitBreakerToken delayReason={delayReason} />
              )}
            </>
          )
        },
      },
    ]
    return columns
  }, [])
  return <Table width="100%" data={rows} columns={columns} {...styleProps} />
}

export default VaultsPendingWithdrawalsTableDesktop

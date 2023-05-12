import Box from '@lyra/ui/components/Box'
import Table, { TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import formatDateTime from '@lyra/ui/utils/formatDateTime'
import formatDuration from '@lyra/ui/utils/formatDuration'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { LiquidityDelayReason, Market, Network } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'
import { CellProps as TableCellProps, Column as TableColum } from 'react-table'

import formatTokenName from '@/app/utils/formatTokenName'
import fromBigNumber from '@/app/utils/fromBigNumber'

import MarketLabelProgress from '../MarketLabelProgress'
import VaultsCircuitBreakerToken from '../VaultsCircuitBreakerToken'
import { VaultsPendingDepositsTableOrListProps } from '.'

type VaultsPendingDepositsTableData = TableData<{
  market: Market
  balance: number
  baseTokenSymbol: string
  vaultQuoteSymbol: string
  network: Network
  requestedDate: number
  timeToEntry: number
  delayReason: LiquidityDelayReason | null
  timeToEntryPercentage: number
}>

const VaultsDepositsTableDesktop = ({ deposits, onClick, ...styleProps }: VaultsPendingDepositsTableOrListProps) => {
  const rows: VaultsPendingDepositsTableData[] = useMemo(() => {
    return deposits.map(deposit => {
      const market = deposit.market()
      const currentTimestamp = market.block.timestamp
      const duration = market.params.depositDelay
      const startTimestamp = deposit.depositRequestedTimestamp
      const progressDuration = Math.min(Math.max(currentTimestamp - startTimestamp, 0), duration)
      const progressPct = duration > 0 ? progressDuration / duration : 0
      const timeToEntry = duration - progressDuration
      const delayReason = deposit.delayReason
      const baseTokenSymbol = formatTokenName(market.baseToken)
      const network = market.lyra.network
      return {
        market: market,
        baseTokenSymbol: baseTokenSymbol,
        balance: fromBigNumber(deposit.value),
        requestedDate: deposit.depositRequestedTimestamp,
        network: network,
        vaultQuoteSymbol: market.quoteToken.symbol,
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
        Header: 'Vault',
        Cell: (props: TableCellProps<VaultsPendingDepositsTableData>) => {
          const { timeToEntryPercentage, market } = props.row.original
          return <MarketLabelProgress market={market} progress={timeToEntryPercentage} color="primaryText" size={30} />
        },
      },
      {
        accessor: 'balance',
        Header: 'Depositing',
        Cell: (props: TableCellProps<VaultsPendingDepositsTableData>) => {
          const { market } = props.row.original
          return (
            <Box>
              <Text>{formatUSD(props.cell.value)}</Text>
              <Text variant="small" color="secondaryText">
                {market.quoteToken.symbol}
              </Text>
            </Box>
          )
        },
      },
      {
        accessor: 'requestedDate',
        Header: 'Requested',
        Cell: (props: TableCellProps<VaultsPendingDepositsTableData>) => {
          return (
            <Text>{formatDateTime(props.cell.value, { hideYear: true, hideMins: false, includeTimezone: true })}</Text>
          )
        },
      },
      {
        accessor: 'timeToEntry',
        Header: 'Time to Deposit',
        Cell: (props: TableCellProps<VaultsPendingDepositsTableData>) => {
          const delayReason = props.row.original.delayReason
          return !delayReason ? (
            <Text>{formatDuration(props.cell.value)}</Text>
          ) : (
            <VaultsCircuitBreakerToken delayReason={delayReason} />
          )
        },
      },
    ]
    return columns
  }, [])
  return <Table width="100%" data={rows} columns={columns} {...styleProps} />
}

export default VaultsDepositsTableDesktop

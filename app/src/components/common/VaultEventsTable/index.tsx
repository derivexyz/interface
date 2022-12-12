import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import Token from '@lyra/ui/components/Token'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedDuration from '@lyra/ui/utils/formatTruncatedDuration'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { LiquidityDeposit, LiquidityWithdrawal } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import filterNulls from '@/app/utils/filterNulls'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getMarketDisplayName from '@/app/utils/getMarketDisplayName'

import MarketImage from '../MarketImage'

type Props = {
  events: (LiquidityDeposit | LiquidityWithdrawal)[]
  onClick?: (event: LiquidityDeposit | LiquidityWithdrawal) => void
  pageSize?: number
} & MarginProps

export type VaultEventTableData = TableData<{
  event: LiquidityDeposit | LiquidityWithdrawal
  vault: string
  isPending: boolean
  value: number
  time: number
  action: string
  marketBaseSymbol: string
  marketQuoteSymbol: string
}>

const VaultEventsTable = ({ events, onClick, pageSize, ...styleProps }: Props) => {
  const rows: VaultEventTableData[] = useMemo(() => {
    return events.map(event => {
      const action = event instanceof LiquidityDeposit ? 'deposit' : 'withdrawal'
      let time = 0
      let value = 0
      const vault = event.market().name
      const marketBaseSymbol = event.market().baseToken.symbol
      const marketQuoteSymbol = event.market().quoteToken.symbol
      const isPending = event.isPending

      if (event instanceof LiquidityDeposit) {
        value = fromBigNumber(event.value)
        time = event.depositTimestamp
      } else if (event instanceof LiquidityWithdrawal) {
        value = fromBigNumber(event.value ?? ZERO_BN)
        time = event.withdrawalTimestamp
      }
      return {
        event,
        vault,
        isPending,
        value,
        time,
        action,
        marketBaseSymbol,
        marketQuoteSymbol,
        onClick: onClick ? () => onClick(event) : undefined,
      }
    })
  }, [events, onClick])

  const isMobile = useIsMobile()

  const columns = useMemo<TableColumn<VaultEventTableData>[]>(() => {
    return filterNulls([
      {
        accessor: 'time',
        Header: 'Time',
        width: 80,
        Cell: (props: TableCellProps<VaultEventTableData>) => {
          const currentTimestamp = props.row.original.event.__market.block.timestamp
          const delta = currentTimestamp - props.cell.value
          return (
            <Text variant="secondary" color="secondaryText">
              {formatTruncatedDuration(delta)}
            </Text>
          )
        },
      },
      {
        accessor: 'vault',
        Header: 'Vault',
        width: 125,
        Cell: (props: TableCellProps<VaultEventTableData>) => {
          return (
            <Flex alignItems="center">
              <MarketImage size={32} name={props.cell.value} />
              <Box ml={2}>
                <Text variant="secondaryMedium">{getMarketDisplayName(props.cell.value)}</Text>
                <Text variant="small" color="secondaryText">
                  {props.row.original.marketBaseSymbol}-{props.row.original.marketQuoteSymbol}
                </Text>
              </Box>
            </Flex>
          )
        },
      },
      isMobile
        ? null
        : {
            accessor: 'action',
            Header: 'Action',
            width: 125,
            Cell: (props: TableCellProps<VaultEventTableData>) => {
              const isPending = props.cell.row.original.isPending
              const isDeposit = props.cell.value === 'deposit'
              const variant = isPending ? 'warning' : isDeposit ? 'primary' : 'default'
              return <Token label={`${isPending ? 'Pending ' : ''} ${props.cell.value}`} variant={variant} />
            },
          },
      {
        accessor: 'value',
        Header: 'Value',
        width: isMobile ? 85 : 125,
        Cell: (props: TableCellProps<VaultEventTableData>) => {
          return <Text>{formatUSD(props.cell.value)}</Text>
        },
      },
    ])
  }, [isMobile])

  if (rows.length === 0) {
    return null
  }

  return <Table width="100%" data={rows} columns={columns} pageSize={pageSize} {...styleProps} />
}

export default VaultEventsTable

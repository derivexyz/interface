import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React, { useMemo } from 'react'

import filterNulls from '@/app/utils/filterNulls'
import formatTruncatedAddress from '@/app/utils/formatTruncatedAddress'

import { NewTradingRewardsReferredTraders } from '../../../../../sdk/src/utils/fetchAccountRewardEpochData'

type Props = {
  referredTraders: NewTradingRewardsReferredTraders
  onClick?: (trader: any) => void
  pageSize?: number
} & MarginProps

export type LeaderboardTableData = TableData<{
  trader: string
  trades: number
  volume: number
  referralRewards: number
}>

const REFERRALS_TABLE_ROW_HEIGHT = 80

const ReferralsTable = ({ referredTraders, onClick, pageSize, ...styleProps }: Props) => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const rows: LeaderboardTableData[] = useMemo(
    () =>
      Object.values(referredTraders).map(trader => {
        return {
          trader: trader.trader,
          trades: trader.trades,
          volume: trader.premium,
          referralRewards: trader.tokens[0].amount,
        }
      }),
    [referredTraders]
  )

  const columns = useMemo<TableColumn<LeaderboardTableData>[]>(() => {
    return filterNulls([
      {
        accessor: 'trader',
        Header: 'Trader',
        width: 100,
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          return <Text color="text">{formatTruncatedAddress(props.cell.value)}</Text>
        },
      },
      {
        accessor: 'trades',
        Header: 'Trades',
        width: 220,
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          return <Text color="text">{props.cell.value}</Text>
        },
      },
      {
        accessor: 'volume',
        Header: 'Volume',
        width: 220,
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          return <Text color="text">{formatTruncatedUSD(props.cell.value)}</Text>
        },
      },
      {
        accessor: 'referralRewards',
        Header: 'Referral Rewards',
        width: 150,
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          return <Text color="text">{formatNumber(props.cell.value)} LYRA</Text>
        },
      },
    ])
  }, [])

  if (rows.length === 0) {
    return null
  }

  return (
    <Table
      data={rows}
      columns={columns}
      pageSize={pageSize}
      {...styleProps}
      rowStyleProps={{
        sx: {
          height: REFERRALS_TABLE_ROW_HEIGHT,
          ':hover': {
            bg: 'cardHoverBg',
            cursor: 'pointer',
          },
          ':active': {
            bg: 'active',
            cursor: 'pointer',
          },
          bg: !isDarkMode && !isMobile ? 'cardShadowBg' : 'cardBg',
          my: 2,
          borderRadius: 21,
        },
      }}
    />
  )
}

export default ReferralsTable

import Center from '@lyra/ui/components/Center'
import Link from '@lyra/ui/components/Link'
import Table, { TableCellProps, TableColumn } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React, { useMemo } from 'react'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import { CompetitionPool, CompetitionSeasonConfig } from '@/app/constants/competition'
import { PageId } from '@/app/constants/pages'
import filterNulls from '@/app/utils/filterNulls'
import formatTruncatedAddress from '@/app/utils/formatTruncatedAddress'
import getPagePath from '@/app/utils/getPagePath'

type FinalLeaderboardTableData = {
  rank: number
  account: string
  realizedPnl: number
  realizedLongPnlPercentage: number
  prize: number
}

type Props = {
  search: string
  season: CompetitionSeasonConfig
  pool: CompetitionPool
}

export default function CompetitionFinalLeaderboardTable({ search, season, pool }: Props) {
  const columns: TableColumn<FinalLeaderboardTableData>[] = useMemo(() => {
    const sortByDollars = !pool.isRankedByPercentage
    return filterNulls([
      {
        accessor: 'rank',
        Header: 'Rank',
        width: 50,
        Cell: (props: TableCellProps<FinalLeaderboardTableData>) => {
          return <Text>{props.cell.value}.</Text>
        },
      },
      {
        accessor: 'account',
        Header: 'Account',
        Cell: (props: TableCellProps<FinalLeaderboardTableData>) => {
          const { account } = props.row.original
          return (
            <Link
              variant="secondary"
              href={getPagePath({ page: PageId.Portfolio }) + '?see=' + account}
              target="_blank"
              showRightIcon
              sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {formatTruncatedAddress(account)}
            </Link>
          )
        },
      },
      {
        accessor: pool.rankKey,
        sortType: 'basic',
        Header: `Profit / Loss (${sortByDollars ? '$' : '%'})`,
        Cell: (props: TableCellProps<FinalLeaderboardTableData>) => {
          return (
            <Text color={props.cell.value === 0 ? 'secondaryText' : props.cell.value > 0 ? 'primaryText' : 'errorText'}>
              {sortByDollars
                ? formatTruncatedUSD(props.cell.value, { showSign: true })
                : formatPercentage(props.cell.value)}
            </Text>
          )
        },
      },
      {
        accessor: 'prize',
        sortType: 'basic',
        Header: 'Prize',
        Cell: (props: TableCellProps<FinalLeaderboardTableData>) => {
          return props.cell.value > 0 ? (
            <TokenAmountText tokenNameOrAddress="OP" amount={props.cell.value} />
          ) : (
            <Center height={24}>
              <Text variant="secondary" color="secondaryText">
                -
              </Text>
            </Center>
          )
        },
      },
    ])
  }, [pool])

  const rows: FinalLeaderboardTableData[] = useMemo(() => {
    return pool.finalLeaderboard
      ? pool.finalLeaderboard
          .map((user, idx) => ({
            rank: idx + 1,
            account: user.account,
            realizedPnl: user.realizedPnl,
            realizedLongPnl: user.realizedLongPnl,
            realizedLongPnlPercentage: user.realizedLongPnlPercentage,
            prize: user.prize,
          }))
          .filter(user => {
            if (search) {
              return user.account.toLowerCase().includes(search.toLowerCase())
            }
            return true
          })
      : []
  }, [pool.finalLeaderboard, search])

  return <Table minHeight={240} columns={columns} data={rows} pageSize={10} />
}

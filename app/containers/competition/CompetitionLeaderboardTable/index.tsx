import Center from '@lyra/ui/components/Center'
import Link from '@lyra/ui/components/Link'
import Spinner from '@lyra/ui/components/Spinner'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React, { useMemo, useRef } from 'react'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import { CompetitionPool, CompetitionSeasonConfig } from '@/app/constants/competition'
import { PageId } from '@/app/constants/pages'
import useIsPaused from '@/app/hooks/admin/useIsPaused'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLeaderboard from '@/app/hooks/position/useLeaderboard'
import filterNulls from '@/app/utils/filterNulls'
import formatTruncatedAddress from '@/app/utils/formatTruncatedAddress'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getPagePath from '@/app/utils/getPagePath'

type LeaderboardTableData = TableData<{
  rank: number
  ensName: string | null
  account: string
  realizedPnl: number
  realizedLongPnl: number
  unrealizedPnl: number
  unrealizedLongPnl: number
  realizedLongPnlPercentage: number
  unrealizedLongPnlPercentage: number
  totalPremiums: number
  totalLongPremiums: number
  totalNotionalVolume: number
  prize: number
}>

type Props = {
  search: string
  season: CompetitionSeasonConfig
  pool: CompetitionPool
}

const CompetitionLeaderboardTable = withSuspense(
  ({ search, season, pool }: Props) => {
    const leaderboard = useLeaderboard(pool.leaderboardFilter)
    const now = useRef(Math.floor(Date.now() / 1000))

    const isPaused = useIsPaused()

    const columns: TableColumn<LeaderboardTableData>[] = useMemo(() => {
      const sortByDollars = !pool.isRankedByPercentage
      return filterNulls([
        {
          accessor: 'rank',
          Header: 'Rank',
          width: 50,
          Cell: (props: TableCellProps<LeaderboardTableData>) => {
            return <Text>{props.cell.value}.</Text>
          },
        },
        {
          accessor: 'account',
          Header: 'Account',
          Cell: (props: TableCellProps<LeaderboardTableData>) => {
            const { ensName, account } = props.row.original
            return (
              <Link
                variant="secondary"
                href={getPagePath({ page: PageId.Portfolio }) + '?see=' + account}
                target="_blank"
                showRightIcon
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {ensName ? ensName : formatTruncatedAddress(account)}
              </Link>
            )
          },
        },
        {
          accessor: 'totalNotionalVolume',
          Header: 'Volume',
          Cell: (props: TableCellProps<LeaderboardTableData>) => {
            return <Text>{formatTruncatedUSD(props.cell.value)}</Text>
          },
        },
        {
          accessor: pool.rankKey,
          sortType: 'basic',
          Header: `Profit / Loss (${sortByDollars ? '$' : '%'})`,
          Cell: (props: TableCellProps<LeaderboardTableData>) => {
            return (
              <Text
                color={props.cell.value === 0 ? 'secondaryText' : props.cell.value > 0 ? 'primaryText' : 'errorText'}
              >
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
          Cell: (props: TableCellProps<LeaderboardTableData>) => {
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

    const rows: LeaderboardTableData[] = useMemo(() => {
      return leaderboard
        .map((user, idx) => ({
          rank: idx + 1,
          account: user.account,
          ensName: user.ensName,
          volume: fromBigNumber(user.totalNotionalVolume),
          realizedPnl: fromBigNumber(user.realizedPnl),
          realizedLongPnl: fromBigNumber(user.realizedLongPnl),
          realizedLongPnlPercentage: fromBigNumber(user.realizedLongPnlPercentage),
          unrealizedPnl: fromBigNumber(user.unrealizedPnl),
          unrealizedLongPnl: fromBigNumber(user.unrealizedLongPnl),
          unrealizedLongPnlPercentage: fromBigNumber(user.unrealizedLongPnlPercentage),
          totalPremiums: fromBigNumber(user.totalPremiums),
          totalLongPremiums: fromBigNumber(user.totalLongPremiums),
          totalNotionalVolume: fromBigNumber(user.totalNotionalVolume),
          prize:
            pool.prizes
              .filter(prize => !!prize.winner)
              .find(prize => prize.rank === idx + 1 || (Array.isArray(prize.rank) && idx + 1 <= prize.rank[1]))
              ?.prize ?? 0,
        }))
        .filter(user => {
          if (search) {
            return (
              user.account.toLowerCase().includes(search.toLowerCase()) ||
              user.ensName?.toLowerCase().includes(search.toLowerCase())
            )
          }
          return true
        })
    }, [leaderboard, pool.prizes, search])

    return rows.length > 0 ? (
      <Table minHeight={240} columns={columns} data={rows} pageSize={10} />
    ) : (
      <Center height={240}>
        {isPaused ? (
          <Text variant="secondary" color="secondaryText">
            Trading is paused
          </Text>
        ) : now.current < season.startTimestamp ? (
          <Countdown prefix="Competition starts in" color="secondaryText" timestamp={season.startTimestamp} />
        ) : (
          <Text variant="secondary" color="secondaryText">
            No results
          </Text>
        )}
      </Center>
    )
  },
  () => (
    <Center height={240}>
      <Spinner />
    </Center>
  )
)

export default CompetitionLeaderboardTable

import Button from '@lyra/ui/components/Button'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import { GlobalRewardEpoch, GlobalRewardEpochTradingBoostTier, Network } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageId } from '@/app/constants/pages'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { TradingRewardsTrader } from '@/app/hooks/leaderboard/useLeaderboardPageData'
import { LyraBalances } from '@/app/utils/common/fetchLyraBalances'
import filterNulls from '@/app/utils/filterNulls'
import formatTruncatedAddress from '@/app/utils/formatTruncatedAddress'
import { getDefaultMarket } from '@/app/utils/getDefaultMarket'
import getPagePath from '@/app/utils/getPagePath'

type Props = {
  network: Network
  leaderboard: TradingRewardsTrader[]
  globalRewardEpoch: GlobalRewardEpoch
  lyraBalances: LyraBalances
  onBoostClick?: () => void
  onClick?: (trader: string) => void
  pageSize?: number
} & MarginProps

export type LeaderboardTableData = TableData<{
  rank: number
  trader: string
  traderEns: string | null
  boost: number
  dailyPoints: number
  totalPoints: number
  onBoostClick?: () => void
}>

const TRADING_LEADERBOARD_ROW_HEIGHT = 80

const getStakedLyraBoost = (tiers: GlobalRewardEpochTradingBoostTier[], stakedLyra: number): number => {
  tiers.sort((a, b) => b.stakingCutoff - a.stakingCutoff)
  const tier = tiers.find(tier => tier.stakingCutoff <= stakedLyra)
  return tier?.boost ?? 1
}

const TradingLeaderboardTable = ({
  network,
  leaderboard,
  globalRewardEpoch,
  lyraBalances,
  onClick,
  onBoostClick,
  pageSize,
  ...styleProps
}: Props) => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const account = useWalletAccount()
  const navigate = useNavigate()

  const rows: LeaderboardTableData[] = useMemo(() => {
    const rows = leaderboard.map((trader, i) => ({
      rank: i,
      trader: trader.trader,
      traderEns: trader.traderEns,
      boost: trader.boost,
      dailyPoints: trader.dailyPoints,
      totalPoints: trader.totalPoints,
      onBoostClick: onBoostClick ? () => onBoostClick() : undefined,
      onClick: onClick ? () => onClick(trader.trader) : undefined,
    }))

    const myRowIdx = rows.findIndex(row => row.trader.toLowerCase() === account?.toLowerCase())
    if (myRowIdx > 0) {
      const myRow = rows[myRowIdx]
      rows.splice(myRowIdx, 1)
      rows.unshift(myRow)
    } else if (account) {
      rows.unshift({
        rank: rows.length,
        trader: account,
        traderEns: null,
        boost: getStakedLyraBoost(globalRewardEpoch.tradingBoostTiers, lyraBalances.totalStkLyra.amount),
        dailyPoints: 0,
        totalPoints: 0,
        onBoostClick: onBoostClick,
        onClick: onClick ? () => onClick(account) : undefined,
      })
    }

    return rows
  }, [
    leaderboard,
    account,
    onBoostClick,
    onClick,
    globalRewardEpoch.tradingBoostTiers,
    lyraBalances.totalStkLyra.amount,
  ])

  const columns = useMemo<TableColumn<LeaderboardTableData>[]>(() => {
    return filterNulls([
      {
        accessor: 'rank',
        Header: 'Rank',
        width: 40,
        Cell: (props: TableCellProps<LeaderboardTableData>) => <Text>{props.cell.value + 1}</Text>,
      },
      {
        accessor: 'trader',
        Header: 'Trader',
        width: 170,
        canSort: false,
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          const { traderEns, trader } = props.row.original
          const formattedAddress = trader === account ? 'You' : traderEns ? traderEns : formatTruncatedAddress(trader)
          return <Text>{formattedAddress}</Text>
        },
      },
      {
        accessor: 'boost',
        Header: 'Boost',
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          return <Text>{props.cell.value}x</Text>
        },
      },
      {
        accessor: 'dailyPoints',
        Header: '24H Points',
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          return <Text>{formatTruncatedNumber(props.cell.value)}</Text>
        },
      },
      {
        accessor: 'totalPoints',
        Header: 'Total Points',
        width: 90,
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          return <Text>{formatTruncatedNumber(props.cell.value)}</Text>
        },
      },
      {
        accessor: 'id',
        Header: '',
        width: 90,
        canSort: false,
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          const { trader, totalPoints } = props.row.original
          return (
            <Flex justifyContent="flex-end" width="100%">
              {account !== trader ? (
                <IconButton icon={IconType.ArrowUpRight} size="md" />
              ) : totalPoints === 0 ? (
                <Button
                  variant="primary"
                  size={isMobile ? 'sm' : 'md'}
                  label="Trade"
                  onClick={e => {
                    e.stopPropagation()
                    navigate(
                      getPagePath({ page: PageId.Trade, network, marketAddressOrName: getDefaultMarket(network) })
                    )
                  }}
                />
              ) : onBoostClick ? (
                <Button
                  variant="primary"
                  size={isMobile ? 'sm' : 'md'}
                  label="Boost"
                  onClick={e => {
                    e.stopPropagation()
                    onBoostClick()
                  }}
                />
              ) : null}
            </Flex>
          )
        },
      },
    ])
  }, [account, isMobile, onBoostClick, navigate, network])

  return (
    <Table
      data={rows}
      columns={columns}
      pageSize={pageSize}
      {...styleProps}
      isOutlineFirstRow={!!account}
      rowStyleProps={{
        sx: {
          height: TRADING_LEADERBOARD_ROW_HEIGHT,
          ':hover': {
            bg: 'cardNestedHover',
            cursor: 'pointer',
          },
          ':active': {
            bg: 'active',
            cursor: 'pointer',
          },
          bg: !isDarkMode && !isMobile ? 'cardShadowBg' : 'cardBg',
          my: 1,
          borderRadius: 21,
        },
      }}
    />
  )
}

export default TradingLeaderboardTable

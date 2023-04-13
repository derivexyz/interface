import Box from '@lyra/ui/components/Box'
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
import React, { useMemo } from 'react'

import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { TradingRewardsTraders } from '@/app/hooks/leaderboard/useLeaderboardPageData'
import filterNulls from '@/app/utils/filterNulls'
import formatTruncatedAddress from '@/app/utils/formatTruncatedAddress'

type Props = {
  traders: TradingRewardsTraders
  onBoostClick?: () => void
  onClick?: (trader: string) => void
  pageSize?: number
} & MarginProps

export type LeaderboardTableData = TableData<{
  rank: number
  trader: string
  boost: number
  showBoostButton: boolean
  rewardSymbol: string
  dailyRewards: number
  totalRewards: number
}>

const TRADING_LEADERBOARD_ROW_HEIGHT = 80

const TradingLeaderboardTable = ({ traders, onClick, onBoostClick, pageSize, ...styleProps }: Props) => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const account = useWalletAccount()
  const accountIsTopWallet = useMemo(() => {
    return traders[0].trader.toLowerCase() === account?.toLowerCase()
  }, [account, traders])
  const rows: LeaderboardTableData[] = useMemo(
    () =>
      traders.map(trader => {
        return {
          rank: trader.rank,
          trader: trader.traderEns ?? trader.trader,
          boost: trader.boost,
          showBoostButton: trader.trader.toLowerCase() === account?.toLowerCase(),
          rewardSymbol: trader.dailyReward.symbol,
          dailyRewards: trader.dailyReward.amount,
          totalRewards: trader.totalRewards.amount,
          onBoostClick: onBoostClick ? () => onBoostClick() : undefined,
          onClick: onClick ? () => onClick(trader.trader) : undefined,
        }
      }),
    [account, onBoostClick, onClick, traders]
  )

  const columns = useMemo<TableColumn<LeaderboardTableData>[]>(() => {
    return filterNulls([
      {
        accessor: 'rank',
        Header: 'Rank',
        width: 50,
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          const { showBoostButton } = props.row.original
          const leftAlign = props.cell.value < 100 ? 2 : 0
          return (
            <Flex flexDirection="row" justifyContent="space-between" alignItems="center" width="100%">
              <Text variant="bodyMedium" color="text" ml={leftAlign}>
                {props.cell.value}
              </Text>
              <Box
                variant="cardSeparator"
                width={3}
                height={showBoostButton ? TRADING_LEADERBOARD_ROW_HEIGHT - 2 : TRADING_LEADERBOARD_ROW_HEIGHT}
              />
            </Flex>
          )
        },
      },
      {
        accessor: 'trader',
        Header: 'Trader',
        width: 150,
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          return (
            <Text variant="bodyMedium" color="text">
              {formatTruncatedAddress(props.cell.value)}
            </Text>
          )
        },
      },
      {
        accessor: 'boost',
        Header: 'Boost',
        width: 150,
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          return (
            <Text variant="bodyMedium" color="text">
              {props.cell.value}x
            </Text>
          )
        },
      },
      {
        accessor: 'dailyRewards',
        Header: '24H Rewards',
        width: 150,
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          const symbol = props.cell.row.original.rewardSymbol
          return (
            <Text variant="bodyMedium" color="text">
              {formatTruncatedNumber(props.cell.value)} {symbol.toUpperCase()}
            </Text>
          )
        },
      },
      {
        accessor: 'totalRewards',
        Header: 'Total Rewards',
        width: 150,
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          const symbol = props.cell.row.original.rewardSymbol
          return (
            <Text variant="bodyMedium" color="text">
              {formatTruncatedNumber(props.cell.value)} {symbol.toUpperCase()}
            </Text>
          )
        },
      },
      {
        accessor: 'showBoostButton',
        Header: '',
        width: 55,
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          const { showBoostButton } = props.row.original
          return (
            <Box>
              {showBoostButton && onBoostClick ? (
                <Button
                  variant="primary"
                  size={isMobile ? 'sm' : 'md'}
                  px={isMobile ? 0 : 2}
                  label="Boost"
                  onClick={e => {
                    onBoostClick()
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                />
              ) : (
                <IconButton ml={[0, 4]} icon={IconType.ArrowUpRight} size="md" />
              )}
            </Box>
          )
        },
      },
    ])
  }, [isMobile, onBoostClick])

  if (rows.length === 0) {
    return null
  }

  return (
    <Table
      data={rows}
      columns={columns}
      pageSize={pageSize}
      {...styleProps}
      isOutlineFirstRow={accountIsTopWallet}
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

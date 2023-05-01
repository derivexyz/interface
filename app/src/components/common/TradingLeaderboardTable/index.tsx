import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import IconButton from '@lyra/ui/components/Button/IconButton'
import { IconType } from '@lyra/ui/components/Icon'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import { Network } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageId } from '@/app/constants/pages'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { TradingRewardsTrader } from '@/app/hooks/leaderboard/useLeaderboardPageData'
import filterNulls from '@/app/utils/filterNulls'
import formatTruncatedAddress from '@/app/utils/formatTruncatedAddress'
import { getDefaultMarket } from '@/app/utils/getDefaultMarket'
import getPagePath from '@/app/utils/getPagePath'

type Props = {
  network: Network
  leaderboard: TradingRewardsTrader[]
  currentTrader: TradingRewardsTrader | null
  onBoostClick?: () => void
  onClick?: (trader: string) => void
  pageSize?: number
} & MarginProps

export type LeaderboardTableData = TableData<{
  trader: string
  traderEns: string | null
  emoji: string | null
  boost: number
  showBoostButton: boolean
  showTradeButton: boolean
  rewardSymbol: string
  dailyRewards: number
  totalRewards: number
  onBoostClick?: () => void
}>

const TRADING_LEADERBOARD_ROW_HEIGHT = 80

const TradingLeaderboardTable = ({
  network,
  leaderboard,
  currentTrader,
  onClick,
  onBoostClick,
  pageSize,
  ...styleProps
}: Props) => {
  const isMobile = useIsMobile()
  const isDarkMode = useIsDarkMode()
  const account = useWalletAccount()
  const navigate = useNavigate()

  let rows: LeaderboardTableData[] = useMemo(
    () =>
      leaderboard.map((trader, i) => {
        let emoji: null | string = null
        if (i === 0) {
          emoji = '🥇'
        } else if (i === 1) {
          emoji = '🥈'
        } else if (i === 2) {
          emoji = '🥉'
        }
        return {
          trader: trader.trader,
          traderEns: trader.traderEns,
          emoji: emoji,
          boost: trader.boost,
          showBoostButton: trader.trader.toLowerCase() === account?.toLowerCase(),
          showTradeButton: false,
          rewardSymbol: trader.dailyReward.symbol,
          dailyRewards: trader.dailyReward.amount,
          totalRewards: trader.totalRewards.amount,
          onBoostClick: onBoostClick ? () => onBoostClick() : undefined,
          onClick: onClick ? () => onClick(trader.trader) : undefined,
        }
      }),
    [account, onBoostClick, onClick, leaderboard]
  )

  const columns = useMemo<TableColumn<LeaderboardTableData>[]>(() => {
    return filterNulls([
      {
        accessor: 'trader',
        Header: 'Trader',
        width: 150,
        Cell: (props: TableCellProps<LeaderboardTableData>) => {
          const { traderEns, trader, emoji } = props.row.original
          const formattedAddress = !!traderEns
            ? formatTruncatedAddress(traderEns, 15, 0)
            : formatTruncatedAddress(trader)
          return (
            <Text variant="bodyMedium" color="text">
              {emoji ? emoji : ''} {formattedAddress}
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
          const { showBoostButton, showTradeButton } = props.row.original
          return (
            <Box>
              {showTradeButton ? (
                <Button
                  variant="primary"
                  size={isMobile ? 'sm' : 'md'}
                  px={isMobile ? 0 : 2}
                  label="Trade"
                  onClick={e => {
                    navigate(
                      getPagePath({ page: PageId.Trade, network, marketAddressOrName: getDefaultMarket(network) })
                    )
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                />
              ) : showBoostButton && onBoostClick ? (
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
  }, [isMobile, onBoostClick, navigate, network])

  if (rows.length === 0) {
    return null
  }

  if (account && currentTrader) {
    const emoji = rows.find(trader => trader.trader.toLowerCase() === currentTrader.trader.toLowerCase())?.emoji ?? null
    rows = rows.filter(row => row.trader !== currentTrader.trader)
    rows.unshift({
      trader: currentTrader.trader,
      traderEns: currentTrader.traderEns,
      boost: currentTrader.boost,
      emoji: emoji,
      showBoostButton: true,
      showTradeButton: currentTrader.totalRewards.amount === 0,
      rewardSymbol: currentTrader.dailyReward.symbol,
      dailyRewards: currentTrader.dailyReward.amount,
      totalRewards: currentTrader.totalRewards.amount,
      onBoostClick: onBoostClick ? () => onBoostClick() : undefined,
      onClick: onClick ? () => onClick(currentTrader.trader) : undefined,
    })
  }

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

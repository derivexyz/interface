import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

import { LogEvent } from '@/app/constants/logEvents'
import { PageId } from '@/app/constants/pages'
import getPagePath from '@/app/utils/getPagePath'
import logEvent from '@/app/utils/logEvent'

import MarketLabel from '../../common/MarketLabel'
import { PortfolioMarketsTableOrListProps } from '.'

type PortfolioMarketsData = TableData<{
  market: string
  price: number
  pricePctChange: number
  openInterest: number
  openInterestDollar: number
  symbol: string
  tradingVolume30D: number
}>

const PortfolioMarketsTableDesktop = ({ markets }: PortfolioMarketsTableOrListProps) => {
  const router = useRouter()
  const rows: PortfolioMarketsData[] = useMemo(() => {
    return markets.map(({ market, spotPrice, spotPriceChange, openInterest, tradingVolume30D }) => {
      return {
        market: market.name,
        price: spotPrice,
        pricePctChange: spotPriceChange,
        openInterest,
        openInterestDollar: openInterest * spotPrice,
        symbol: market.name,
        tradingVolume30D,
        onClick: () => {
          logEvent(LogEvent.PortfolioMarketClick, {
            marketName: market.name,
            marketAddress: market.address,
          })
          router.push(getPagePath({ page: PageId.Trade, marketAddressOrName: market.name }))
        },
      }
    })
  }, [markets, router])
  const columns = useMemo<TableColumn<PortfolioMarketsData>[]>(
    () => [
      {
        accessor: 'market',
        Header: 'Market',
        Cell: (props: TableCellProps<PortfolioMarketsData>) => {
          return <MarketLabel marketName={props.cell.value} />
        },
      },
      {
        accessor: 'price',
        Header: '24H Price',
        Cell: (props: TableCellProps<PortfolioMarketsData>) => {
          const price = formatUSD(props.cell.value)
          const percentage = formatPercentage(props.row.original.pricePctChange, false)
          return (
            <Flex flexDirection="column">
              <Text variant="secondary">{price}</Text>
              <Text variant="small" color={props.row.original.pricePctChange >= 0 ? 'primaryText' : 'errorText'}>
                {percentage}
              </Text>
            </Flex>
          )
        },
      },
      {
        accessor: 'openInterestDollar',
        Header: 'Open Interest',
        Cell: (props: TableCellProps<PortfolioMarketsData>) => {
          return (
            <Box>
              <Text variant="secondary">{formatTruncatedUSD(props.cell.value)}</Text>
              <Text variant="small" color="secondaryText">
                {formatTruncatedNumber(props.row.original.openInterest)} {props.row.original.symbol}
              </Text>
            </Box>
          )
        },
      },
      {
        accessor: 'tradingVolume30D',
        Header: '30D Volume',
        Cell: (props: TableCellProps<PortfolioMarketsData>) => {
          return <Text variant="secondary">{props.cell.value !== 0 ? formatTruncatedUSD(props.cell.value) : '-'}</Text>
        },
      },
    ],
    []
  )
  return <Table width="100%" data={rows} columns={columns} />
}

export default PortfolioMarketsTableDesktop

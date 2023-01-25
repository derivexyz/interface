import Flex from '@lyra/ui/components/Flex'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market, Network } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { LogEvent } from '@/app/constants/logEvents'
import { PageId } from '@/app/constants/pages'
import formatTokenName from '@/app/utils/formatTokenName'
import getPagePath from '@/app/utils/getPagePath'
import logEvent from '@/app/utils/logEvent'

import MarketLabel from '../../common/MarketLabel'
import { PortfolioMarketsTableOrListProps } from '.'

type PortfolioMarketsData = TableData<{
  market: Market
  marketName: string
  network: Network
  price: number
  pricePctChange: number
  openInterest: number
  openInterestDollar: number
  symbol: string
  tradingVolume30D: number
}>

const PortfolioMarketsTableDesktop = ({ marketData }: PortfolioMarketsTableOrListProps) => {
  const navigate = useNavigate()
  const rows: PortfolioMarketsData[] = useMemo(() => {
    return marketData.map(({ market, spotPrice, spotPrice24HChange, openInterest, totalNotionalVolume30D }) => {
      return {
        market,
        marketName: market.name,
        network: market.lyra.network,
        price: spotPrice,
        pricePctChange: spotPrice24HChange,
        openInterest,
        openInterestDollar: openInterest,
        symbol: formatTokenName(market.baseToken),
        tradingVolume30D: totalNotionalVolume30D,
        onClick: () => {
          logEvent(LogEvent.PortfolioMarketClick, {
            marketName: market.name,
            marketAddress: market.address,
          })
          navigate(
            getPagePath({
              page: PageId.Trade,
              network: market.lyra.network,
              marketAddressOrName: market.name,
            })
          )
        },
      }
    })
  }, [marketData, navigate])
  const columns = useMemo<TableColumn<PortfolioMarketsData>[]>(
    () => [
      {
        accessor: 'marketName',
        Header: 'Market',
        Cell: (props: TableCellProps<PortfolioMarketsData>) => {
          const { market } = props.cell.row.original
          return <MarketLabel market={market} />
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
        accessor: 'tradingVolume30D',
        Header: '30D Volume',
        Cell: (props: TableCellProps<PortfolioMarketsData>) => {
          return (
            <Text variant="secondary" color={props.cell.value !== 0 ? 'text' : 'secondaryText'}>
              {props.cell.value !== 0 ? formatTruncatedUSD(props.cell.value) : '-'}
            </Text>
          )
        },
      },
      {
        accessor: 'openInterestDollar',
        Header: 'Open Interest',
        Cell: (props: TableCellProps<PortfolioMarketsData>) => {
          return <Text variant="secondary">{formatTruncatedUSD(props.cell.value)}</Text>
        },
      },
    ],
    []
  )
  return <Table width="100%" data={rows} columns={columns} />
}

export default PortfolioMarketsTableDesktop

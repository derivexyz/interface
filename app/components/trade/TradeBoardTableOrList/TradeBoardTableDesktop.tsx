import Box from '@lyra/ui/components/Box'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Table, { TableCellProps, TableColumn, TableData, TableElement } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import filterNulls from '@lyra/ui/utils/filterNulls'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Quote, QuoteDisabledReason } from '@lyrafinance/lyra-js'
import React, { useMemo, useState } from 'react'

import { ONE_BN, ZERO_BN } from '@/app/constants/bn'
import { MAX_IV } from '@/app/constants/contracts'
import { LogEvent } from '@/app/constants/logEvents'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getDefaultQuoteSize from '@/app/utils/getDefaultQuoteSize'
import logEvent, { LogData } from '@/app/utils/logEvent'

import OptionStatsGrid from '../../common/OptionStatsGrid'
import { TradeBoardTableOrListProps } from '.'
import TradeBoardPriceButton from './TradeBoardPriceButton'

type OptionData = TableData<{
  quote: Quote
  strike: number
  strikeId: number
  iv: number
  marketAddressOrName: string
  breakEven: number
  toBreakEven: number
  price: number
  disabledReason: QuoteDisabledReason | null
}>

const getLogData = (quote: Quote): LogData => ({
  marketName: quote.marketName,
  marketAddress: quote.marketAddress,
  isCall: quote.isCall,
  strikeId: quote.strikeId,
  strikePrice: quote.strikePrice,
  boardId: quote.boardId,
  expiryTimestamp: quote.expiryTimestamp,
})

const TradeBoardTableDesktop = ({
  isBuy,
  selectedOption,
  onSelectOption,
  quotes,
}: TradeBoardTableOrListProps): TableElement<OptionData> => {
  const [expandedStrikes, setExpandedStrikes] = useState<Record<string, boolean>>({})
  const market = quotes.length ? quotes[0].option.market() : null
  const size = getDefaultQuoteSize(market?.name ?? '') // defaults to one
  const spotPrice = fromBigNumber(market?.spotPrice ?? ZERO_BN)
  const rows: OptionData[] = useMemo(() => {
    const rows = filterNulls(
      quotes.map(({ bid, ask, option }) => {
        const quote = isBuy ? bid : ask
        const isExpanded = !!expandedStrikes[quote.strike().id.toString()]
        const id = quote.strike().id.toString()
        return {
          id,
          quote,
          strikeId: quote.strike().id,
          marketAddressOrName: quote.market().address,
          strike: fromBigNumber(quote.strike().strikePrice),
          iv: fromBigNumber(quote.iv),
          price: fromBigNumber(quote.pricePerOption),
          breakEven: fromBigNumber(quote.breakEven),
          toBreakEven: fromBigNumber(quote.breakEven.sub(market?.spotPrice ?? ZERO_BN)),
          disabledReason: quote.disabledReason,
          isExpanded,
          onToggleExpand: (isExpanded: boolean) => {
            setExpandedStrikes(expandedStrikes => ({
              ...expandedStrikes,
              [quote.strike().id.toString()]: isExpanded,
            }))
            logEvent(isExpanded ? LogEvent.BoardStrikeExpand : LogEvent.BoardStrikeCollapse, getLogData(quote))
          },
          isExpandedContentClickable: true,
          expanded: (
            <Box pb={4} px={3}>
              <Text variant="bodyMedium" mb={4}>
                Stats
              </Text>
              <OptionStatsGrid option={option} isBuy={isBuy} />
            </Box>
          ),
        }
      })
    )

    return rows
  }, [quotes, isBuy, expandedStrikes, market?.spotPrice])

  const columns = useMemo<TableColumn<OptionData>[]>(
    () => [
      {
        accessor: 'strike',
        Header: 'Strike',
        disableSortBy: true,
        Cell: (props: TableCellProps<OptionData>) => (
          <Text variant="secondaryMedium">{props.cell.value > 0 ? formatUSD(props.cell.value) : '-'}</Text>
        ),
      },
      {
        accessor: 'breakEven',
        Header: 'Break Even',
        disableSortBy: true,
        Cell: (props: TableCellProps<OptionData>) => (
          <Text variant="secondary">{props.cell.value > 0 ? formatUSD(props.cell.value) : '-'}</Text>
        ),
      },
      {
        accessor: 'toBreakEven',
        Header: 'To Break Even',
        disableSortBy: true,
        Cell: (props: TableCellProps<OptionData>) => (
          <Text variant="secondary">{(props.cell.value > 0 ? '+' : '') + formatUSD(props.cell.value)}</Text>
        ),
      },
      {
        accessor: 'iv',
        Header: 'Implied Volatility',
        disableSortBy: true,
        Cell: (props: TableCellProps<OptionData>) => (
          <Text variant="secondary">
            {props.cell.value > 0 && props.cell.value < fromBigNumber(MAX_IV)
              ? formatPercentage(props.cell.value, true)
              : '-'}
          </Text>
        ),
      },
      {
        accessor: 'price',
        Header: !market || size.eq(ONE_BN) ? 'Price' : `Price (${fromBigNumber(size)} ${market.name})`,
        disableSortBy: true,
        Cell: (props: TableCellProps<OptionData>) => {
          const { quote, strikeId } = props.row.original
          const isSelected = selectedOption?.strike().id === strikeId
          return (
            <TradeBoardPriceButton
              quote={quote}
              isSelected={isSelected}
              onSelected={() => onSelectOption(quote.option())}
            />
          )
        },
      },
    ],
    [market, size, selectedOption, onSelectOption]
  )

  const spotPriceMarker = useMemo(() => {
    const spotPriceRowIdx = rows.reduce(
      (markerIdx, row) => (row.strike && spotPrice < row.strike ? markerIdx : markerIdx + 1),
      0
    )
    return { rowIdx: spotPriceRowIdx, content: formatUSD(spotPrice) }
  }, [spotPrice, rows])

  return (
    <CardSection noPadding>
      <Table data={rows} columns={columns} tableRowMarker={spotPriceMarker} />
    </CardSection>
  )
}

export default TradeBoardTableDesktop

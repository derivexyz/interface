import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import filterNulls from '@lyra/ui/utils/filterNulls'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Quote, QuoteDisabledReason } from '@lyrafinance/lyra-js'
import React, { useMemo, useState } from 'react'

import { LogEvent } from '@/app/constants/logEvents'
import formatTokenName from '@/app/utils/formatTokenName'
import fromBigNumber from '@/app/utils/fromBigNumber'
import logEvent, { LogData } from '@/app/utils/logEvent'

import OptionStatsGrid from '../../common/OptionStatsGrid'
import { TradeBoardTableOrListProps } from '.'
import TradeBoardPriceButton from './TradeBoardPriceButton'

type OptionData = TableData<{
  quote: Quote
  strike: number
  strikeId: number
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
  board,
  quotes,
  isBuy,
  selectedOption,
  onSelectOption,
}: TradeBoardTableOrListProps) => {
  const [expandedStrikes, setExpandedStrikes] = useState<Record<string, boolean>>({})
  const spotPrice = fromBigNumber(board.market().spotPrice)
  const rows: OptionData[] = useMemo(() => {
    const rows = filterNulls(
      quotes.map(({ bid, ask, option }) => {
        const quote = isBuy ? ask : bid
        if (!quote) {
          return null
        }
        const isExpanded = !!expandedStrikes[quote.strike().id.toString()]
        const strike = option.strike()
        const strikeId = strike.id
        return {
          id: strikeId.toString(),
          quote,
          strikeId,
          marketAddressOrName: quote.market().address,
          strike: fromBigNumber(strike.strikePrice),
          price: fromBigNumber(quote.pricePerOption),
          breakEven: fromBigNumber(quote.breakEven),
          toBreakEven: fromBigNumber(quote.toBreakEven),
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
              <Text variant="bodyMedium" mb={6}>
                Stats
              </Text>
              <OptionStatsGrid option={option} bid={bid} ask={ask} />
            </Box>
          ),
        }
      })
    )
    return rows
  }, [quotes, isBuy, expandedStrikes])

  const columns = useMemo<TableColumn<OptionData>[]>(
    () => [
      {
        accessor: 'strike',
        Header: 'Strike',
        disableSortBy: true,
        Cell: (props: TableCellProps<OptionData>) => (
          <Text variant="bodyMedium">{props.cell.value > 0 ? formatUSD(props.cell.value) : '-'}</Text>
        ),
      },
      {
        accessor: 'breakEven',
        Header: 'Break Even',
        disableSortBy: true,
        Cell: (props: TableCellProps<OptionData>) => (
          <Text>{props.cell.value > 0 ? formatUSD(props.cell.value) : '-'}</Text>
        ),
      },
      {
        accessor: 'toBreakEven',
        Header: 'To Break Even',
        disableSortBy: true,
        Cell: (props: TableCellProps<OptionData>) => (
          <Text>{(props.cell.value > 0 ? '+' : '') + formatUSD(props.cell.value)}</Text>
        ),
      },
      {
        accessor: 'price',
        Header: 'Price',
        disableSortBy: true,
        width: 120,
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
    [selectedOption, onSelectOption]
  )

  const spotPriceMarker = useMemo(() => {
    const spotPriceRowIdx = rows.reduce(
      (markerIdx, row) => (row.strike && spotPrice < row.strike ? markerIdx : markerIdx + 1),
      0
    )
    return {
      rowIdx: rows.length,
      content: (
        <Flex sx={{ position: 'relative' }} alignItems="center" width="100%">
          <Box sx={{ position: 'absolute', right: 0, left: 0, top: '18px', height: '4px', bg: 'cardHoverBg' }} />
          <Flex
            mx={[2, 3]}
            px={[1, 3]}
            my={1}
            py={1}
            bg="cardHoverBg"
            sx={{ borderRadius: 'list', position: 'relative', zIndex: 1 }}
          >
            <Text variant="small">
              {formatTokenName(board.market().baseToken)} Price:{' '}
              <Text as="span" color="primaryText">
                {formatUSD(spotPrice)}
              </Text>
            </Text>
          </Flex>
        </Flex>
      ),
    }
  }, [board, rows, spotPrice])

  if (rows.length === 0) {
    return null
  }

  return <Table data={rows} columns={columns} tableRowMarker={spotPriceMarker} />
}

export default TradeBoardTableDesktop

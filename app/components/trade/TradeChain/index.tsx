import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Table, { TableCellProps, TableColumn } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Board, Option, Strike } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import { UNIT } from '@/app/constants/bn'
import { TRADE_CHAIN_MIN_HEIGHT } from '@/app/constants/layout'
import { getCustomColumnWidth, OptionChainTableData } from '@/app/containers/trade/TradeAdvancedBoardCard'
import { CustomColumnOption } from '@/app/hooks/local_storage/useTraderSettings'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getDefaultQuoteSize from '@/app/utils/getDefaultQuoteSize'

import TradeChainPriceButton from './TradeChainPriceButton'

export const getButtonWidthForMarket = (marketName: string) => {
  switch (marketName.toLowerCase()) {
    case 'btc':
      return 112
    default:
      return 96
  }
}

const renderCustomColumn = (strike: Strike | null, customCol: CustomColumnOption, isCall: boolean) => {
  if (!strike) {
    return '0'
  }
  switch (customCol) {
    case CustomColumnOption.IV:
      return formatPercentage(fromBigNumber(strike.iv), true)
    case CustomColumnOption.Gamma:
    case CustomColumnOption.Vega:
      return formatNumber(strike[customCol])
    case CustomColumnOption.Delta:
    case CustomColumnOption.Theta:
      return formatNumber(isCall ? strike.call()[customCol] : strike.put()[customCol])
    case CustomColumnOption.OI: {
      const option = isCall ? strike.call() : strike.put()
      return formatTruncatedUSD(
        option.longOpenInterest.add(option.shortOpenInterest).mul(option.market().spotPrice).div(UNIT)
      )
    }
  }
}

type Props = {
  board: Board
  selectedOption: Option | null
  isBuy: boolean
  customCol1: CustomColumnOption
  customCol2: CustomColumnOption
  onSelectOption: (option: Option, isBuy: boolean, isCall: boolean) => void
}

type OptionData = Omit<OptionChainTableData, 'isExpanded'>

const TradeChain = ({ board, selectedOption, onSelectOption, isBuy, customCol1, customCol2 }: Props) => {
  const size = getDefaultQuoteSize(board.market().name ?? '') // defaults to one
  const isCall = selectedOption?.isCall ?? true
  const marketName = board.market().name
  const spotPrice = fromBigNumber(board.market().spotPrice)
  const columns = useMemo<TableColumn<OptionData>[]>(
    () => [
      {
        accessor: 'strike',
        id: `custom-col-1-left`,
        width: getCustomColumnWidth(customCol1),
        Cell: (props: TableCellProps<OptionData>) => {
          const { strike } = props.row.original
          return <Text variant="secondary">{renderCustomColumn(strike, customCol1, true)}</Text>
        },
      },
      {
        accessor: 'strike',
        id: `custom-col-2-left`,
        width: getCustomColumnWidth(customCol2),
        Cell: (props: TableCellProps<OptionData>) => {
          const { strike } = props.row.original
          return <Text variant="secondary">{renderCustomColumn(strike, customCol2, true)}</Text>
        },
      },
      {
        accessor: 'callBid',
        Header: 'Bid',
        disableSortBy: true,
        width: getButtonWidthForMarket(marketName),
        Cell: (props: TableCellProps<OptionData>) => {
          const { callBid } = props.row.original
          const isSelected = selectedOption?.strike().id === callBid?.strikeId && isCall && !isBuy
          return callBid ? (
            <TradeChainPriceButton
              quote={callBid}
              isBid={true}
              isSelected={isSelected}
              onSelected={() => {
                onSelectOption(callBid.option(), false, callBid.option().isCall)
              }}
            />
          ) : null
        },
      },
      {
        accessor: 'callAsk',
        Header: 'Ask',
        disableSortBy: true,
        width: getButtonWidthForMarket(marketName),
        Cell: (props: TableCellProps<OptionData>) => {
          const { callAsk } = props.row.original
          const isSelected = selectedOption?.strike().id === callAsk?.strikeId && isCall && isBuy
          return callAsk ? (
            <TradeChainPriceButton
              quote={callAsk}
              isBid={false}
              isSelected={isSelected}
              onSelected={() => {
                onSelectOption(callAsk.option(), true, callAsk.option().isCall)
              }}
            />
          ) : null
        },
      },
      {
        accessor: 'strikePrice',
        Header: 'Expiry / Strike',
        headerAlign: 'center',
        width: 140,
        disableSortBy: true,
        style: { borderRight: '1px solid' },
        Cell: (props: TableCellProps<OptionData>) => (
          <Flex width="100%" justifyContent="center">
            <Text variant="secondaryMedium">
              {props.cell.value > 0 ? formatUSD(props.cell.value, { dps: 2 }) : '-'}
            </Text>
          </Flex>
        ),
      },
      {
        accessor: 'putBid',
        Header: 'Bid',
        disableSortBy: true,
        width: getButtonWidthForMarket(marketName),
        Cell: (props: TableCellProps<OptionData>) => {
          const { putBid } = props.row.original
          const isSelected = selectedOption?.strike().id === putBid?.strikeId && !isCall && !isBuy
          return putBid ? (
            <TradeChainPriceButton
              quote={putBid}
              isBid={true}
              isSelected={isSelected}
              onSelected={() => {
                onSelectOption(putBid.option(), false, false)
              }}
            />
          ) : null
        },
      },
      {
        accessor: 'putAsk',
        Header: 'Ask',
        disableSortBy: true,
        width: getButtonWidthForMarket(marketName),
        Cell: (props: TableCellProps<OptionData>) => {
          const { putAsk } = props.row.original
          const isSelected = selectedOption?.strike().id === putAsk?.strikeId && !isCall && isBuy
          return putAsk ? (
            <TradeChainPriceButton
              quote={putAsk}
              isBid={false}
              isSelected={isSelected}
              onSelected={() => {
                onSelectOption(putAsk.option(), true, false)
              }}
            />
          ) : null
        },
      },
      {
        accessor: 'strike',
        id: 'custom-col-2-right',
        width: getCustomColumnWidth(customCol2),
        Cell: (props: TableCellProps<OptionData>) => {
          const { strike } = props.row.original
          return <Text variant="secondary">{renderCustomColumn(strike, customCol2, false)}</Text>
        },
      },
      {
        accessor: 'strike',
        id: `custom-col-1-right`,
        width: getCustomColumnWidth(customCol1),
        Cell: (props: TableCellProps<OptionData>) => {
          const { strike } = props.row.original
          return <Text variant="secondary">{renderCustomColumn(strike, customCol1, false)}</Text>
        },
      },
    ],
    [isCall, selectedOption, onSelectOption, isBuy, customCol1, customCol2, marketName]
  )

  const columnOptions = useMemo(() => [{}, {}, { px: 0 }, { px: 0 }, { px: 0 }, { px: 0 }, { px: 0 }, {}, {}], [])

  const rows: OptionData[] = useMemo(() => {
    return board
      .strikes()
      .sort((a, b) => fromBigNumber(a.strikePrice.sub(b.strikePrice)))
      .reduce((allStrikes, strike) => {
        // Bid from AMM => trader sell-side
        const callBid = strike.call().quoteSync(false, size)
        const putBid = strike.put().quoteSync(false, size)
        // Ask from AMM => trader buy-side
        const callAsk = strike.call().quoteSync(true, size)
        const putAsk = strike.put().quoteSync(true, size)
        const isStrikeDisabled = callBid.isDisabled && callAsk.isDisabled && putBid.isDisabled && putAsk.isDisabled
        return isStrikeDisabled
          ? allStrikes
          : [
              ...allStrikes,
              {
                callBid,
                callAsk,
                putBid,
                putAsk,
                strikePrice: fromBigNumber(strike.strikePrice),
                strike: strike,
                expiry: board.expiryTimestamp,
                noExpandedPadding: true,
              },
            ]
      }, [] as OptionData[])
  }, [board, size])

  const spotPriceMarker = useMemo(() => {
    const spotPriceRowIdx = rows.reduce(
      (markerIdx, row) => (row.strikePrice && spotPrice < row.strikePrice ? markerIdx : markerIdx + 1),
      0
    )
    return { rowIdx: spotPriceRowIdx, content: formatUSD(spotPrice) }
  }, [rows, spotPrice])

  if (rows.length === 0) {
    return (
      <Center minHeight={TRADE_CHAIN_MIN_HEIGHT}>
        <Text variant="secondary" color="secondaryText">
          No strikes are available for this expiry
        </Text>
      </Center>
    )
  }

  return (
    <Table hideHeader columns={columns} data={rows} columnOptions={columnOptions} tableRowMarker={spotPriceMarker} />
  )
}

export default TradeChain

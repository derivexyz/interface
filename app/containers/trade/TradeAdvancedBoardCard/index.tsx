import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Spinner from '@lyra/ui/components/Spinner'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import formatDate from '@lyra/ui/utils/formatDate'
import { Market, Option, Quote, Strike } from '@lyrafinance/lyra-js'
import React, { useMemo, useState } from 'react'

import TradeChain, { getButtonWidthForMarket } from '@/app/components/trade/TradeChain'
import { TRADE_BOARD_MIN_HEIGHT } from '@/app/constants/layout'
import { LogEvent } from '@/app/constants/logEvents'
import withSuspense from '@/app/hooks/data/withSuspense'
import useTraderSettings, { CustomColumnOption } from '@/app/hooks/local_storage/useTraderSettings'
import useLiveBoards from '@/app/hooks/market/useLiveBoards'
import logEvent from '@/app/utils/logEvent'

type Props = {
  market: Market
  selectedOption: Option | null
  onSelectOption: (option: Option, isBuy: boolean, isCall: boolean) => void
  isBuy: boolean
}

export type OptionChainData = {
  callBid: Quote | null
  callAsk: Quote | null
  putBid: Quote | null
  putAsk: Quote | null
  strikePrice: number | null
  strike: Strike | null
  expiry: number
  isExpanded: boolean
}

export type OptionChainTableData = TableData<OptionChainData>

const getCustomColumnLabel = (columnOption: CustomColumnOption) => {
  switch (columnOption) {
    case CustomColumnOption.Delta:
      return 'Delta'
    case CustomColumnOption.IV:
      return 'Implied Vol'
    case CustomColumnOption.Gamma:
      return 'Gamma'
    case CustomColumnOption.Theta:
      return 'Theta'
    case CustomColumnOption.Vega:
      return 'Vega'
    case CustomColumnOption.OI:
      return 'Open Interest'
  }
}

export const getCustomColumnWidth = (columnOption: CustomColumnOption) => {
  switch (columnOption) {
    case CustomColumnOption.IV:
      return 124
    default:
      return 96
  }
}

const TradeAdvancedBoardCard = withSuspense(
  ({ market, selectedOption, onSelectOption, isBuy }: Props) => {
    const [expandedExpiries, setExpandedExpiries] = useState<Record<string, boolean>>({})
    const boards = useLiveBoards(market.name)
    const defaultExpandedBoardId = useMemo(() => {
      const now = boards[0].block.timestamp
      return boards.find(board => board.tradingCutoffTimestamp > now)?.id ?? boards[0].id
    }, [boards])
    const [isCustomCol1LeftOpen, setIsCustomCol1LeftOpen] = useState(false)
    const [isCustomCol1RightOpen, setIsCustomCol1RightOpen] = useState(false)
    const [isCustomCol2LeftOpen, setIsCustomCol2LeftOpen] = useState(false)
    const [isCustomCol2RightOpen, setIsCustomCol2RightOpen] = useState(false)
    const [tradeSettings, setTradeSettings] = useTraderSettings()
    const customCol1 = tradeSettings.customCol1
    const customCol2 = tradeSettings.customCol2

    const col1DropdownButtonListItems = useMemo(() => {
      return Object.values(CustomColumnOption)
        .filter(value => value !== customCol2)
        .map(option => (
          <DropdownButtonListItem
            key={option}
            isSelected={option === customCol1}
            label={getCustomColumnLabel(option)}
            onClick={() => {
              setTradeSettings('customCol1', option)
              setIsCustomCol1LeftOpen(false)
              setIsCustomCol1RightOpen(false)
            }}
          />
        ))
    }, [customCol2, customCol1, setTradeSettings])

    const col2DropdownButtonListItems = useMemo(() => {
      return Object.values(CustomColumnOption)
        .filter(value => value !== customCol1)
        .map(option => (
          <DropdownButtonListItem
            key={option}
            isSelected={option === customCol2}
            label={getCustomColumnLabel(option)}
            onClick={() => {
              setTradeSettings('customCol2', option)
              setIsCustomCol2LeftOpen(false)
              setIsCustomCol2RightOpen(false)
            }}
          />
        ))
    }, [customCol1, customCol2, setTradeSettings])

    const columns = useMemo<TableColumn<OptionChainTableData>[]>(
      () => [
        {
          accessor: 'strike',
          id: `custom-col-1-selector-left`,
          width: getCustomColumnWidth(customCol1),
          Header: (
            <DropdownButton
              variant="light"
              textVariant="secondary"
              textAlign="left"
              isTransparent
              label={getCustomColumnLabel(customCol1)}
              isOpen={isCustomCol1LeftOpen}
              onClick={() => {
                setIsCustomCol1LeftOpen(!isCustomCol1LeftOpen)
              }}
              onClose={() => setIsCustomCol1LeftOpen(false)}
            >
              {col1DropdownButtonListItems}
            </DropdownButton>
          ),
          disableSortBy: true,
          Cell: () => null,
        },
        {
          accessor: 'strike',
          id: `custom-col-2-selector-left`,
          width: getCustomColumnWidth(customCol2),
          px: 0,
          Header: (
            <DropdownButton
              variant="light"
              textAlign="left"
              textVariant="secondary"
              isTransparent
              label={getCustomColumnLabel(customCol2)}
              isOpen={isCustomCol2LeftOpen}
              onClick={() => {
                setIsCustomCol2LeftOpen(!isCustomCol2LeftOpen)
              }}
              onClose={() => setIsCustomCol2LeftOpen(false)}
            >
              {col2DropdownButtonListItems}
            </DropdownButton>
          ),
          disableSortBy: true,
          Cell: () => null,
        },
        {
          accessor: 'callBid',
          Header: 'Bid',
          disableSortBy: true,
          width: getButtonWidthForMarket(market.name),
        },
        {
          accessor: 'callAsk',
          Header: 'Ask',
          disableSortBy: true,
          width: getButtonWidthForMarket(market.name),
          Cell: (props: TableCellProps<OptionChainTableData>) => {
            const { isExpanded } = props.row.original
            return isExpanded ? (
              <Flex width="100%">
                <Text ml="auto" variant="secondary">
                  Calls
                </Text>
              </Flex>
            ) : null
          },
        },
        {
          accessor: 'expiry',
          Header: 'Expiry / Strike',
          headerAlign: 'center',
          disableSortBy: true,
          width: 140,
          Cell: (props: TableCellProps<OptionChainTableData>) => (
            <Flex width="100%" justifyContent="center">
              <Text variant="secondaryMedium">{props.cell.value > 0 ? formatDate(props.cell.value, true) : '-'}</Text>
            </Flex>
          ),
        },
        {
          accessor: 'putBid',
          Header: 'Bid',
          disableSortBy: true,
          width: getButtonWidthForMarket(market.name),
          Cell: (props: TableCellProps<OptionChainTableData>) => {
            const { isExpanded } = props.row.original
            return isExpanded ? <Text variant="secondary">Puts</Text> : null
          },
        },
        {
          accessor: 'putAsk',
          Header: 'Ask',
          disableSortBy: true,
          width: getButtonWidthForMarket(market.name),
          Cell: () => null,
        },
        {
          accessor: 'strike',
          id: `custom-col-2-selector-right`,
          width: getCustomColumnWidth(customCol2),
          Header: (
            <DropdownButton
              variant="light"
              textAlign="left"
              textVariant="secondary"
              isTransparent
              label={getCustomColumnLabel(customCol2)}
              isOpen={isCustomCol2RightOpen}
              onClick={() => setIsCustomCol2RightOpen(!isCustomCol2RightOpen)}
              onClose={() => setIsCustomCol2RightOpen(false)}
            >
              {col2DropdownButtonListItems}
            </DropdownButton>
          ),
          disableSortBy: true,
          Cell: () => null,
        },
        {
          accessor: 'strike',
          id: `custom-col-1-selector-right`,
          width: getCustomColumnWidth(customCol1),
          Header: (
            <DropdownButton
              variant="light"
              textAlign="left"
              textVariant="secondary"
              isTransparent
              label={getCustomColumnLabel(customCol1)}
              isOpen={isCustomCol1RightOpen}
              onClick={() => {
                setIsCustomCol1RightOpen(!isCustomCol1RightOpen)
              }}
              onClose={() => setIsCustomCol1RightOpen(false)}
            >
              {col1DropdownButtonListItems}
            </DropdownButton>
          ),
          disableSortBy: true,
          Cell: (props: TableCellProps<OptionChainTableData>) => {
            const { isExpanded } = props.row.original
            return (
              <Flex width="100%">
                <Icon size={16} ml="auto" icon={isExpanded ? IconType.ChevronUp : IconType.ChevronDown}></Icon>
              </Flex>
            )
          },
        },
      ],
      [
        customCol1,
        customCol2,
        isCustomCol1RightOpen,
        isCustomCol1LeftOpen,
        isCustomCol2LeftOpen,
        isCustomCol2RightOpen,
        col1DropdownButtonListItems,
        col2DropdownButtonListItems,
        market.name,
      ]
    )

    const columnOptions = useMemo(
      () => [
        {
          px: 3,
        },
        { px: 0 },
        {},
        {},
        {},
        {},
        {},
        { px: 0 },
        { pr: 6, pl: 0 },
      ],
      []
    )

    const rows: OptionChainTableData[] = useMemo(
      () =>
        boards.map(board => {
          return {
            expiry: board.expiryTimestamp,
            isExpanded: expandedExpiries[board.expiryTimestamp.toString()] ?? defaultExpandedBoardId === board.id,
            onToggleExpand: isExpanded => {
              setExpandedExpiries(expandedExpiries => ({
                ...expandedExpiries,
                [board.expiryTimestamp.toString()]: isExpanded,
              }))
              logEvent(isExpanded ? LogEvent.ChainBoardExpand : LogEvent.ChainBoardCollapse, {
                board: board.id,
                expiry: board.expiryTimestamp,
              })
            },
            noExpandedPadding: true,
            isExpandedContentClickable: false,
            expanded: (
              <TradeChain
                customCol1={customCol1}
                customCol2={customCol2}
                board={board}
                selectedOption={selectedOption}
                onSelectOption={onSelectOption}
                isBuy={isBuy}
              />
            ),
            callBid: null,
            callAsk: null,
            putAsk: null,
            putBid: null,
            strikePrice: null,
            strike: null,
          }
        }),
      [boards, expandedExpiries, selectedOption, onSelectOption, isBuy, defaultExpandedBoardId, customCol1, customCol2]
    )

    return (
      <Card>
        <CardBody noPadding>
          <Table columns={columns} data={rows} columnOptions={columnOptions} />
        </CardBody>
      </Card>
    )
  },
  () => (
    <Card>
      <CardBody noPadding>
        <Center minHeight={TRADE_BOARD_MIN_HEIGHT}>
          <Spinner />
        </Center>
      </CardBody>
    </Card>
  )
)

export default TradeAdvancedBoardCard

import Box from '@lyra/ui/components/Box'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import DropdownIconButton from '@lyra/ui/components/Button/DropdownIconButton'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Option, Position } from '@lyrafinance/lyra-js'
import React, { useMemo, useState } from 'react'

import { UNIT, ZERO_BN } from '@/app/constants/bn'
import TradeCollateralFormModal from '@/app/containers/trade/TradeCollateralFormModal'
import TradeFormModal from '@/app/containers/trade/TradeFormModal'
import filterNulls from '@/app/utils/filterNulls'
import fromBigNumber from '@/app/utils/fromBigNumber'

import PositionItem from '../PositionItem'

type Props = {
  positions: Position[]
  onClick?: (position: Position) => void
  pageSize?: number
} & MarginProps

export type PositionTableData = TableData<{
  position: Position
  option: Option
  lastUpdatedTimestamp: number
  expiryTimestamp: number
  equity: number
  pricePerOption: number
  averageCostPerOption: number
  pnl: number
  pnlPercentage: number
}>

const PositionsTable = ({ positions, onClick, pageSize, ...styleProps }: Props) => {
  const rows: PositionTableData[] = useMemo(
    () =>
      (
        positions
          .map(position => {
            try {
              const option = position.liveOption()
              return { position, option }
            } catch (err) {
              return null
            }
          })
          .filter(o => o != null) as { position: Position; option: Option }[]
      ).map(({ position, option }) => {
        const {
          realizedPnl,
          realizedPnlPercentage,
          settlementPnl,
          settlementPnlPercentage,
          unrealizedPnl,
          unrealizedPnlPercentage,
        } = position.pnl()

        const pnl = position.isOpen ? unrealizedPnl : position.isSettled ? settlementPnl : realizedPnl
        const pnlPercentage = position.isOpen
          ? unrealizedPnlPercentage
          : position.isSettled
          ? settlementPnlPercentage
          : realizedPnlPercentage

        const lastTrade = position.lastTrade()
        const lastUpdatedTimestamp = position.isSettled ? position.expiryTimestamp : lastTrade?.timestamp ?? 0

        return {
          position,
          option,
          lastUpdatedTimestamp,
          expiryTimestamp: position.expiryTimestamp,
          equity: fromBigNumber(
            position.isLong
              ? position.pricePerOption.mul(position.size).div(UNIT)
              : position.collateral?.value ?? ZERO_BN
          ),
          pricePerOption: fromBigNumber(position.pricePerOption),
          averageCostPerOption: fromBigNumber(position.averageCostPerOption()),
          pnl: fromBigNumber(pnl),
          pnlPercentage: fromBigNumber(pnlPercentage),
          onClick: onClick ? () => onClick(position) : undefined,
        }
      }),
    [positions, onClick]
  )

  const [closeParams, setCloseParams] = useState<{ position: Position; option: Option } | null>(null)
  const [addParams, setAddParams] = useState<{ position: Position; option: Option } | null>(null)
  const [adjustParams, setAdjustParams] = useState<{ position: Position; option: Option } | null>(null)

  const columns = useMemo<TableColumn<PositionTableData>[]>(() => {
    return filterNulls([
      {
        accessor: 'expiryTimestamp',
        Header: 'Position',
        minWidth: 220,
        Cell: (props: TableCellProps<PositionTableData>) => {
          const { position } = props.row.original
          return <PositionItem position={position} />
        },
      },
      {
        accessor: 'equity',
        Header: 'Equity',
        Cell: (props: TableCellProps<PositionTableData>) => {
          const equity = props.cell.value
          const { position } = props.row.original
          const { liquidationPrice } = position.collateral ?? {}
          return (
            <Box>
              <Text>{formatUSD(equity)}</Text>
              {liquidationPrice ? (
                <Text variant="small" color="secondaryText">
                  Liq {formatTruncatedUSD(liquidationPrice)}
                </Text>
              ) : null}
            </Box>
          )
        },
      },
      {
        accessor: 'averageCostPerOption',
        Header: 'Average Cost',
        Cell: (props: TableCellProps<PositionTableData>) => {
          return <Text>{props.cell.value ? formatUSD(props.cell.value) : '-'}</Text>
        },
      },
      {
        accessor: 'pricePerOption',
        Header: 'Current Price',
        Cell: (props: TableCellProps<PositionTableData>) => {
          return <Text>{formatUSD(props.cell.value)}</Text>
        },
      },
      {
        accessor: 'pnl',
        Header: 'Profit / Loss',
        maxWidth: 120,
        Cell: (props: TableCellProps<PositionTableData>) => {
          const { pnlPercentage } = props.row.original
          return (
            <Box>
              <Text color={pnlPercentage === 0 ? 'text' : pnlPercentage > 0 ? 'primaryText' : 'errorText'}>
                {formatUSD(props.cell.value, { showSign: true })}
              </Text>
              {pnlPercentage ? (
                <Text variant="small" color="secondaryText">
                  {formatPercentage(pnlPercentage)}
                </Text>
              ) : null}
            </Box>
          )
        },
      },
      {
        accessor: 'id',
        Header: '',
        width: 40,
        Cell: (props: TableCellProps<PositionTableData>) => {
          const { position, option } = props.row.original
          const [isOpen, setIsOpen] = useState(false)
          return (
            <Flex justifyContent="flex-end" width="100%">
              <DropdownIconButton
                onClick={e => {
                  e.stopPropagation()
                  setIsOpen(true)
                }}
                variant="light"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                icon={IconType.MoreHorizontal}
                mobileTitle="Edit Position"
              >
                <DropdownButtonListItem
                  label="Close Position"
                  onClick={e => {
                    e.stopPropagation()
                    setCloseParams({ position, option })
                    setIsOpen(false)
                  }}
                />
                <DropdownButtonListItem
                  label="Add Size"
                  onClick={e => {
                    e.stopPropagation()
                    setAddParams({ position, option })
                    setIsOpen(false)
                  }}
                />
                {!position.isLong ? (
                  <DropdownButtonListItem
                    label="Adjust Collateral"
                    onClick={e => {
                      e.stopPropagation()
                      setAdjustParams({ position, option })
                      setIsOpen(false)
                    }}
                  />
                ) : null}
              </DropdownIconButton>
            </Flex>
          )
        },
      },
    ])
  }, [])

  if (rows.length === 0) {
    return null
  }

  return (
    <>
      <Table data={rows} columns={columns} pageSize={pageSize} {...styleProps} />
      {closeParams ? (
        <TradeFormModal
          isOpen={true}
          onClose={() => setCloseParams(null)}
          onTrade={() => setCloseParams(null)}
          isBuy={!closeParams.position.isLong}
          {...closeParams}
        />
      ) : null}
      {addParams ? (
        <TradeFormModal
          isOpen={true}
          onClose={() => setAddParams(null)}
          onTrade={() => setAddParams(null)}
          isBuy={addParams.position.isLong}
          {...addParams}
        />
      ) : null}
      {adjustParams ? (
        <TradeCollateralFormModal
          isOpen={true}
          onClose={() => setAdjustParams(null)}
          onTrade={() => setAdjustParams(null)}
          {...adjustParams}
        />
      ) : null}
    </>
  )
}

export default PositionsTable

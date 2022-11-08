import { BigNumberish } from '@ethersproject/bignumber'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React, { useCallback, useMemo, useState } from 'react'
import { Cell, CellProps, Column, Row, useFlexLayout, useRowState, useSortBy, useTable } from 'react-table'
import { Box, Flex } from 'rebass'
import { LayoutProps, MarginProps } from 'styled-system'

import Collapsible from '../Collapsible'
import Text from '../Text'
import TableRowMarker, { TableRowMarkerProps } from './TableRowMarker'

const DEFAULT_CELL_PX = 3
const DEFAULT_EDGE_CELL_PX = 6

export type TableRecordType = Record<string, boolean | BigNumberish | { [key: string]: any } | null>

type TableMarkerOptions = {
  rowIdx: number
} & TableRowMarkerProps

export type TableData<T extends TableRecordType> = {
  id?: string
  isExpanded?: boolean
  noExpandedPadding?: boolean
  expanded?: React.ReactNode
  onToggleExpand?: (isExpanded: boolean) => void
  onClick?: () => void
  isExpandedContentClickable?: boolean
} & T

export type TableProps<T extends TableRecordType> = {
  data: Array<TableData<T>>
  // Columns must be memoized https://react-table.tanstack.com/docs/api/useTable#table-options
  columns: Array<Column<TableData<T>>>
  columnOptions?: Array<ColumnOptions>
  pageSize?: number
  isOutline?: boolean
  hideHeader?: boolean
  tableRowMarker?: TableMarkerOptions
} & MarginProps &
  LayoutProps

export type ColumnOptions = {
  px?: number
  pl?: number
  pr?: number
}

export type TableColumn<D extends Record<string, unknown> = any> = Column<D>

export type TableRow<D extends Record<string, unknown> = any> = Row<D>

export type TableCellProps<D extends Record<string, unknown>, V = any> = CellProps<D, V>

export type TableElement<T extends TableRecordType> = React.ReactElement<TableProps<T>>

/* 
  To bypass TypeScript type checking, we had to resort to the `as any`
  hack. This is a safe compromise since we handle null value gracefully.
*/
export default function Table<T extends TableRecordType>({
  columns,
  data,
  pageSize,
  isOutline,
  hideHeader = false,
  columnOptions,
  tableRowMarker: tableMarker,
  ...styleProps
}: TableProps<T>): TableElement<T> {
  const isMobile = useIsMobile()
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    useFlexLayout,
    useRowState
  )

  const [page, _setPage] = useState(0)

  const numPages = pageSize ? Math.ceil(rows.length / pageSize) : 1
  const setPage = useCallback(
    (page: number) => {
      if (page >= 0 && page < numPages) {
        _setPage(page)
      }
    },
    [numPages, _setPage]
  )
  const pagedRows = useMemo(() => {
    if (!pageSize) {
      return rows
    } else {
      const start = page * pageSize
      return rows.slice(start, start + pageSize)
    }
  }, [rows, page, pageSize])

  const cellPy = isMobile ? 2 : 4

  return (
    <Box {...styleProps}>
      <Box
        // TODO: @dappbeast Remove px
        px={isMobile ? 3 : 0}
        overflowX="auto"
        overflowY="hidden"
      >
        <Box width="100%" height="100%" as="table" {...(getTableProps() as any)} sx={{ borderCollapse: 'collapse' }}>
          {!hideHeader ? (
            <Flex as="thead" pt={4} pb={2}>
              {headerGroups.map((headerGroup, idx) => (
                <Box key={idx} as="tr" {...(headerGroup.getHeaderGroupProps() as any)}>
                  {headerGroup.headers.map((column, colIdx) => {
                    const header = column.render('Header')
                    const headerProps = column.getHeaderProps()
                    const sortByToggleProps = (column as any)?.getSortByToggleProps()
                    const canSort = !!(column as any).canSort
                    const isSorted = !!(column as any).isSorted
                    const isSortedDesc = !!(column as any).isSortedDesc
                    const headerAlign = (column as any).headerAlign
                    const colPx = columnOptions && columnOptions[colIdx] ? columnOptions[colIdx].px : null
                    const colPl = columnOptions && columnOptions[colIdx] ? columnOptions[colIdx].pl : null
                    const colPr = columnOptions && columnOptions[colIdx] ? columnOptions[colIdx].pr : null
                    return (
                      <Flex
                        justifyContent={headerAlign ?? 'flex-start'}
                        alignItems="center"
                        as="th"
                        px={colPx ?? DEFAULT_CELL_PX}
                        pl={colPl ?? colPx ?? (colIdx === 0 ? DEFAULT_EDGE_CELL_PX : DEFAULT_CELL_PX)}
                        pr={
                          colPr ??
                          colPx ??
                          (colIdx === headerGroup.headers.length - 1 ? DEFAULT_EDGE_CELL_PX : DEFAULT_CELL_PX)
                        }
                        {...headerProps}
                        key={column.id}
                      >
                        {React.isValidElement(header) ? (
                          <Box key={column.id}>{header}</Box>
                        ) : (
                          <Text
                            key={column.id}
                            variant="secondary"
                            color={isSorted ? 'text' : 'secondaryText'}
                            textAlign="left"
                            onClick={sortByToggleProps?.onClick}
                            sx={{
                              cursor: canSort ? 'pointer' : undefined,
                              ':hover': {
                                color: canSort ? 'text' : undefined,
                              },
                            }}
                          >
                            {header}
                          </Text>
                        )}
                        {isSorted ? (
                          <Icon
                            key={column.id}
                            strokeWidth={3}
                            ml={2}
                            color={isSorted ? 'text' : 'secondaryText'}
                            size={12}
                            mb="1px"
                            icon={isSortedDesc ? IconType.ArrowDown : IconType.ArrowUp}
                          />
                        ) : null}
                      </Flex>
                    )
                  })}
                </Box>
              ))}
            </Flex>
          ) : null}
          {pagedRows.map((row, rowIdx) => {
            prepareRow(row)
            const isExpanded = !!row.original.isExpanded
            const noExpandedPadding = !!row.original.noExpandedPadding

            const prepareRowProps = (row: Row<TableData<T>>) => {
              const rowProps = row.getRowProps()
              const { style } = rowProps

              return {
                ...rowProps,
                style: {
                  ...style,
                },
              }
            }

            const prepareCellProps = (cell: Cell<TableData<T>, any>) => {
              const cellProps = cell.getCellProps()
              const { style } = cellProps

              return {
                ...cellProps,
                style: {
                  ...style,
                },
              }
            }
            const expandedContent = row.original.expanded
            const isClickable = !!row.original.onClick || !!expandedContent
            const isExpandedContentClickable = !!row.original.isExpandedContentClickable
            return (
              <Box
                as="tbody"
                key={row.id}
                sx={{
                  cursor: isClickable && isExpandedContentClickable ? 'pointer' : null,
                  bg:
                    isClickable && isExpandedContentClickable ? (!isExpanded ? 'transparent' : 'hover') : 'transparent',
                  '&:hover': {
                    bg: isClickable && isExpandedContentClickable ? (isExpanded ? 'active' : 'hover') : 'transparent',
                  },
                  '&:active': {
                    bg: isClickable && isExpandedContentClickable ? 'active' : 'transparent',
                  },
                  borderBottom: isOutline && rowIdx < pagedRows.length - 1 ? '1px solid' : undefined,
                  borderColor: 'background',
                }}
              >
                {tableMarker && rowIdx === tableMarker.rowIdx ? (
                  <TableRowMarker content={tableMarker.content} mt={tableMarker.rowIdx === 0 ? 6 : 0} />
                ) : null}
                <Box
                  as="tr"
                  sx={{
                    cursor: !isClickable && !isExpandedContentClickable ? 'inherit' : 'pointer',
                    bg: isClickable && !isExpandedContentClickable && isExpanded ? 'hover' : 'transparent',
                    '&:hover': {
                      bg:
                        isClickable && !isExpandedContentClickable ? (isExpanded ? 'active' : 'hover') : 'transparent',
                    },
                    '&:active': {
                      bg: isClickable && !isExpandedContentClickable ? 'active' : 'transparent',
                    },
                  }}
                  {...(prepareRowProps(row) as any)}
                >
                  {row.cells.map((cell: any, cellIdx) => {
                    const cellPx = columnOptions && columnOptions[cellIdx] ? columnOptions[cellIdx].px : null
                    const cellPl = columnOptions && columnOptions[cellIdx] ? columnOptions[cellIdx].pl : null
                    const cellPr = columnOptions && columnOptions[cellIdx] ? columnOptions[cellIdx].pr : null
                    return (
                      <Flex
                        onClick={() => {
                          if (row.original.onToggleExpand) {
                            row.original.onToggleExpand(!isExpanded)
                          }
                          if (row.original.onClick) {
                            row.original.onClick()
                          }
                        }}
                        as="td"
                        key={cellIdx}
                        alignItems="center"
                        px={cellPx ?? DEFAULT_CELL_PX}
                        pl={cellPl ?? cellPx ?? (cellIdx === 0 ? DEFAULT_EDGE_CELL_PX : DEFAULT_CELL_PX)}
                        pr={
                          cellPr ??
                          cellPx ??
                          (cellIdx === row.cells.length - 1 ? DEFAULT_EDGE_CELL_PX : DEFAULT_CELL_PX)
                        }
                        py={cellPy}
                        {...(prepareCellProps(cell) as any)}
                      >
                        {cell.render('Cell')}
                      </Flex>
                    )
                  })}
                </Box>
                {tableMarker && tableMarker.rowIdx > rows.length - 1 && rowIdx === rows.length - 1 ? (
                  <TableRowMarker content={tableMarker.content} mb={6} />
                ) : null}
                {expandedContent ? (
                  <Box
                    onClick={() => {
                      if (row.original.isExpandedContentClickable) {
                        if (row.original.onToggleExpand) {
                          row.original.onToggleExpand(!isExpanded)
                        }
                        if (row.original.onClick) {
                          row.original.onClick()
                        }
                      }
                    }}
                    as="tr"
                    sx={{
                      borderBottom: !isOutline && isExpanded && rowIdx < pagedRows.length - 1 ? '2px solid' : undefined,
                      borderBottomColor: 'background',
                    }}
                  >
                    <Box as="td">
                      <Collapsible noPadding isExpanded={isExpanded}>
                        <Box px={noExpandedPadding ? 0 : DEFAULT_CELL_PX} py={noExpandedPadding ? 0 : cellPy}>
                          {expandedContent}
                        </Box>
                      </Collapsible>
                    </Box>
                  </Box>
                ) : null}
              </Box>
            )
          })}
        </Box>
      </Box>
      {numPages > 1 ? (
        <Flex px={DEFAULT_CELL_PX} py={3} justifyContent="center" alignItems="center">
          <IconButton
            variant="light"
            isTransparent
            onClick={() => setPage(Math.max(0, page - 1))}
            icon={IconType.ChevronLeft}
          />
          <Text variant="small" color="secondaryText" mx={3}>
            {page + 1} / {numPages}
          </Text>
          <IconButton
            variant="light"
            isTransparent
            onClick={() => setPage(Math.min(numPages - 1, page + 1))}
            icon={IconType.ChevronRight}
          />
        </Flex>
      ) : null}
    </Box>
  )
}

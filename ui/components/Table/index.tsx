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

export type TableRecordType = Record<string, boolean | BigNumberish | { [key: string]: any } | null>

export type TableData<T extends TableRecordType> = {
  id?: string
  isExpanded?: boolean
  expanded?: React.ReactNode
  onToggleExpand?: (isExpanded: boolean) => void
  onClick?: () => void
} & T

export type TableProps<T extends TableRecordType> = {
  data: Array<TableData<T>>
  // Columns must be memoized https://react-table.tanstack.com/docs/api/useTable#table-options
  columns: Array<TableColumn<TableData<T>>>
  pageSize?: number
  isOutline?: boolean
} & MarginProps &
  LayoutProps

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

  const cellPx = isMobile ? 3 : 6
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
          <Flex as="thead" py={4}>
            {headerGroups.map((headerGroup, idx) => (
              <Box key={idx} as="tr" {...(headerGroup.getHeaderGroupProps() as any)}>
                {headerGroup.headers.map(column => {
                  const header = column.render('Header')
                  const headerProps = column.getHeaderProps()
                  const sortByToggleProps = (column as any)?.getSortByToggleProps()
                  const canSort = !!(column as any).canSort
                  const isSorted = !!(column as any).isSorted
                  const isSortedDesc = !!(column as any).isSortedDesc
                  return (
                    <Flex alignItems="center" as="th" px={cellPx} {...headerProps} key={column.id}>
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
          {pagedRows.map((row, rowIdx) => {
            prepareRow(row)
            const isExpanded = !!row.original.isExpanded

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
            return (
              <Box
                as="tbody"
                key={row.id}
                sx={{
                  cursor: !isClickable ? 'inherit' : 'pointer',
                  bg: !isClickable ? 'transparent' : !isExpanded ? 'transparent' : 'hover',
                  '&:hover': {
                    bg: !isClickable ? 'transparent' : isExpanded ? 'active' : 'hover',
                  },
                  '&:active': {
                    bg: !isClickable ? 'transparent' : 'active',
                  },
                  borderBottom: isOutline && rowIdx < pagedRows.length - 1 ? '1px solid' : undefined,
                  borderBottomColor: 'background',
                }}
                onClick={() => {
                  if (row.original.onToggleExpand) {
                    row.original.onToggleExpand(!isExpanded)
                  }
                  if (row.original.onClick) {
                    row.original.onClick()
                  }
                }}
              >
                <Box as="tr" {...(prepareRowProps(row) as any)}>
                  {row.cells.map((cell: any, cellIdx) => {
                    return (
                      <Flex
                        as="td"
                        key={cellIdx}
                        alignItems="center"
                        px={cellPx}
                        py={cellPy}
                        {...(prepareCellProps(cell) as any)}
                      >
                        {cell.render('Cell')}
                      </Flex>
                    )
                  })}
                </Box>
                {expandedContent ? (
                  <Box
                    as="tr"
                    sx={{
                      borderBottom: !isOutline && isExpanded && rowIdx < pagedRows.length - 1 ? '2px solid' : undefined,
                      borderBottomColor: 'background',
                    }}
                  >
                    <Box as="td">
                      <Collapsible noPadding isExpanded={isExpanded}>
                        <Box px={cellPx} py={cellPy}>
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
        <Flex px={cellPx} py={3} justifyContent="center" alignItems="center">
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

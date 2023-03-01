import Card, { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import React, { useMemo } from 'react'

type ExampleTableCell = TableData<{
  first: string
  second: string
  third: string
}>

export default function TableDemoCard({ ...marginProps }: MarginProps): CardElement {
  const tableColumns: TableColumn<ExampleTableCell>[] = useMemo(
    () => [
      {
        accessor: 'first',
        Header: 'First Column',
        Cell: (props: TableCellProps<ExampleTableCell>) => <Text>{props.cell.value}</Text>,
      },
      {
        accessor: 'second',
        disableSortBy: true,
        Header: 'Second Column',
        Cell: (props: TableCellProps<ExampleTableCell>) => <Text>{props.cell.value}</Text>,
      },
      {
        accessor: 'third',
        Header: 'Third Column',
        Cell: (props: TableCellProps<ExampleTableCell>) => <Text>{props.cell.value}</Text>,
      },
    ],
    []
  )

  const data: ExampleTableCell[] = useMemo(() => {
    return [
      {
        first: 'Row 1 First',
        second: 'Row 1 First',
        third: 'Row 1 Third',
        expanded: <Text>Expanded value</Text>,
      },
      {
        first: 'Row 2 First',
        second: 'Row 2 First',
        third: 'Row 2 Third',
        expanded: <Text>Expanded value</Text>,
      },
      {
        first: 'Row 3 First',
        second: 'Row 3 First',
        third: 'Row 3 Third',
        expanded: <Text>Expanded value</Text>,
      },
    ]
  }, [])

  return (
    <Card {...marginProps} overflow="hidden" flexDirection="row">
      <CardSection noPadding isHorizontal flexGrow={1}>
        <Table columns={tableColumns} data={data} />
      </CardSection>
      <CardSeparator isVertical />
      <CardSection noPadding isHorizontal flexGrow={1}>
        <Table columns={tableColumns} data={data} isOutline />
      </CardSection>
    </Card>
  )
}

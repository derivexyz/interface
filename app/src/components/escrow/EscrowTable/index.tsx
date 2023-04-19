import Flex from '@lyra/ui/components/Flex'
import Icon from '@lyra/ui/components/Icon'
import { IconType } from '@lyra/ui/components/Icon'
import Link from '@lyra/ui/components/Link'
import Table, { TableCellProps, TableColumn, TableData, TableElement } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import formatDate from '@lyra/ui/utils/formatDate'
import React, { useMemo } from 'react'

import { AppNetwork } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import TransactionButton from '@/app/containers/common/TransactionButton'
import { EscrowEventData } from '@/app/hooks/escrow/useEscrowPageData'
import formatTruncatedAddress from '@/app/utils/formatTruncatedAddress'

import TokenAmountText from '../../common/TokenAmountText'

export type EscrowTableProps = {
  escrowEvents: EscrowEventData[]
  handleClaimEscrow: (escrowProxy: string | null) => void
} & MarginProps &
  LayoutProps

type EscrowEventTableData = TableData<{
  vestingBegin: number
  vestingEnd: number
  initialLocked: number
  vestingCliff: number
  escrowContractAddress: string
  claimableBalance: number
}>

const EscrowTable = ({
  escrowEvents,
  handleClaimEscrow,
  ...styleProps
}: EscrowTableProps): TableElement<EscrowEventTableData> => {
  const rows: EscrowEventTableData[] = useMemo(() => {
    return escrowEvents.map(event => {
      return {
        vestingBegin: event.vestingBegin,
        vestingEnd: event.vestingEnd,
        vestingCliff: event.vestingCliff,
        initialLocked: event.amount,
        escrowContractAddress: event.escrowProxy,
        claimableBalance: event.claimableBalance,
      }
    })
  }, [escrowEvents])

  const columns = useMemo<TableColumn<EscrowEventTableData>[]>(() => {
    const columns: TableColumn<EscrowEventTableData>[] = [
      {
        accessor: 'vestingBegin',
        Header: 'Start Date',
        Cell: (props: TableCellProps<EscrowEventTableData>) => {
          const { vestingBegin } = props.row.original
          const formattedVestingBegin = formatDate(vestingBegin)
          return <Text variant="secondary">{formattedVestingBegin}</Text>
        },
      },
      {
        accessor: 'vestingEnd',
        Header: 'End Date',
        Cell: (props: TableCellProps<EscrowEventTableData>) => {
          const { vestingEnd } = props.row.original
          const formattedVestingEnd = formatDate(vestingEnd)
          return <Text variant="secondary">{formattedVestingEnd}</Text>
        },
      },
      {
        accessor: 'initialLocked',
        Header: 'Initial Locked',
        Cell: (props: TableCellProps<EscrowEventTableData>) => {
          const { initialLocked } = props.row.original
          return <TokenAmountText tokenNameOrAddress="lyra" amount={initialLocked} />
        },
      },
      {
        accessor: 'vestingCliff',
        Header: 'Cliff',
        Cell: (props: TableCellProps<EscrowEventTableData>) => {
          const { vestingCliff } = props.row.original
          const formattedVestingCliff = formatDate(vestingCliff)
          return <Text variant="secondary">{formattedVestingCliff}</Text>
        },
      },
      {
        accessor: 'escrowContractAddress',
        Header: 'Escrow Contract Address',
        Cell: (props: TableCellProps<EscrowEventTableData>) => {
          const { escrowContractAddress } = props.row.original
          return (
            <>
              <Link target="_blank" key="escrow" href={`https://etherscan.io/address/${escrowContractAddress}`}>
                <Flex sx={{ textOverflow: 'ellipsis' }}>
                  <Text mr={1}>{formatTruncatedAddress(escrowContractAddress, 6, 4, '...')}</Text>
                  <Icon size="16" icon={IconType.ExternalLink} />
                </Flex>
              </Link>
            </>
          )
        },
      },
      {
        accessor: 'claimableBalance',
        Header: 'Claimable Balance',
        Cell: (props: TableCellProps<EscrowEventTableData>) => {
          const { claimableBalance } = props.row.original
          return <TokenAmountText tokenNameOrAddress="lyra" amount={claimableBalance} />
        },
      },
      {
        id: 'claim',
        Cell: (props: TableCellProps<EscrowEventTableData>) => {
          const { claimableBalance } = props.row.original
          const escrowProxy = escrowEvents[props.row.index].escrowProxy
          return (
            <TransactionButton
              width={120}
              transactionType={TransactionType.ClaimEscrow}
              network={AppNetwork.Ethereum}
              label="Claim"
              isDisabled={claimableBalance <= 0}
              onClick={async () => handleClaimEscrow(escrowProxy)}
            />
          )
        },
      },
    ]
    return columns
  }, [escrowEvents])

  return <Table width="100%" data={rows} columns={columns} {...styleProps} />
}

export default EscrowTable

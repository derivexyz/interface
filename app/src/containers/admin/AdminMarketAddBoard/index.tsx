import { BigNumber } from '@ethersproject/bignumber'
import { PopulatedTransaction } from '@ethersproject/contracts'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Input from '@lyra/ui/components/Input'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Modal from '@lyra/ui/components/Modal'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import formatDateTime from '@lyra/ui/utils/formatDateTime'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { AdminBoardParams, Market } from '@lyrafinance/lyra-js'
import React, { useMemo, useState } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import { UNIT, ZERO_BN } from '@/app/constants/bn'
import { TransactionType } from '@/app/constants/screen'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminTransaction from '@/app/hooks/admin/useAdminTransaction'
import fromBigNumber from '@/app/utils/fromBigNumber'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  market: Market
}

type Listing = {
  strike: BigNumber
  skew: BigNumber
}

type ListingWithIv = TableData<
  Listing & {
    iv: BigNumber
  }
>

const AdminMarketAddBoard = ({ market }: Props) => {
  const admin = useAdmin(market.lyra.network)
  const [isOpen, setIsOpen] = useState(false)
  const [expiry, setExpiry] = useState<string>('')
  const [baseIv, setBaseIv] = useState<BigNumber>(ZERO_BN)
  const [listings, setListings] = useState<Listing[]>([{ strike: ZERO_BN, skew: ZERO_BN }])
  const execute = useAdminTransaction(market.lyra.network, market.params.owner)
  const expiryPlaceholder = (Date.now() / 1000).toFixed(0)
  const isAddBoardDisabled =
    !expiry ||
    isNaN(parseInt(expiry)) ||
    baseIv.isZero() ||
    listings.length === 0 ||
    listings.some(l => l.strike.isZero() || l.skew.isZero())
  const [tx, setTx] = useState<PopulatedTransaction | null>(null)
  const [newBoardParams, setNewBoardParams] = useState<AdminBoardParams | null>(null)

  const rows = useMemo(
    () =>
      newBoardParams
        ? newBoardParams.strikePrices.map((strike, i) => ({
            strike: strike,
            skew: newBoardParams.skews[i],
            iv: newBoardParams.skews[i].mul(newBoardParams.baseIV).div(UNIT),
          }))
        : [],
    [newBoardParams]
  )
  const columns = useMemo<TableColumn<TableData<ListingWithIv>>[]>(
    () => [
      {
        accessor: 'strike',
        Header: 'Strike',
        Cell: (props: TableCellProps<ListingWithIv>) => (
          <Text variant="secondary">{fromBigNumber(props.cell.value)}</Text>
        ),
      },
      {
        accessor: 'skew',
        Header: 'Skew',
        Cell: (props: TableCellProps<ListingWithIv>) => (
          <Text variant="secondary">{fromBigNumber(props.cell.value)}</Text>
        ),
      },
      {
        accessor: 'iv',
        Header: 'IV',
        Cell: (props: TableCellProps<ListingWithIv>) => (
          <Text variant="secondary">{fromBigNumber(props.cell.value)}</Text>
        ),
      },
    ],
    []
  )

  return (
    <Card>
      <CardSection>
        <Text mb={6} variant="heading">
          Add Board
        </Text>
        <Input
          mb={6}
          error={
            isNaN(parseInt(expiry)) && expiry !== ''
              ? 'Not a number'
              : parseInt(expiry) < Date.now() / 1000
              ? 'Expiry in past'
              : false
          }
          label="Expiry"
          value={expiry}
          onChange={e => setExpiry(e.target.value)}
          placeholder={expiryPlaceholder}
          rightContent={
            <Text color="secondaryText" ml={2}>
              {formatDateTime(!isNaN(parseInt(expiry)) ? parseInt(expiry) : parseInt(expiryPlaceholder))}
            </Text>
          }
        />
        <BigNumberInput mb={6} label="Base IV" value={baseIv} onChange={setBaseIv} placeholder={'1'} />
        <Text mb={6} variant="heading2">
          Strikes
        </Text>
        {Array.from(listings).map((_listing, idx) => {
          return (
            <Flex key={idx} mb={6} alignItems="flex-end">
              <BigNumberInput
                mr={6}
                flexGrow={1}
                label="Strike Price"
                value={listings[idx].strike}
                onChange={strike => {
                  const newArray = [...listings]
                  newArray[idx].strike = strike
                  setListings(newArray)
                }}
              />
              <BigNumberInput
                flexGrow={1}
                label="Skew"
                value={listings[idx].skew}
                onChange={skew => {
                  const newArray = [...listings]
                  newArray[idx].skew = skew
                  setListings(newArray)
                }}
                mr={6}
              />
              <LabelItem
                minWidth={60}
                mb={2}
                label="IV"
                value={formatNumber(listings[idx].skew.mul(baseIv).div(UNIT))}
                mr={6}
              />
              <IconButton
                size="md"
                icon={IconType.X}
                isDisabled={listings.length <= 1}
                onClick={() => {
                  const newArray = [...listings]
                  newArray.splice(idx, 1)
                  setListings(newArray)
                }}
              />
            </Flex>
          )
        })}
        <Button
          onClick={() => setListings([...listings, { strike: ZERO_BN, skew: ZERO_BN }])}
          leftIcon={IconType.Plus}
          size="lg"
          label="Add Strike"
          width={200}
        />
      </CardSection>
      <CardSeparator />
      <CardSection>
        <TransactionButton
          transactionType={TransactionType.Admin}
          network={market.lyra.network}
          isDisabled={isAddBoardDisabled}
          label="Add Board"
          onClick={async () => {
            const { tx, board } = await admin.addBoard(
              market.address,
              !isNaN(parseInt(expiry)) ? BigNumber.from(parseInt(expiry)) : ZERO_BN,
              baseIv,
              listings.map(listing => listing.strike),
              listings.map(listing => listing.skew)
            )
            setTx(tx)
            setNewBoardParams(board)
            setIsOpen(!isOpen)
          }}
        />
      </CardSection>
      <Modal title="Add Board" isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CardBody>
          {newBoardParams ? (
            <>
              <Box px={[8, 4]}>
                <Flex>
                  <Text color="secondaryText" mr={2}>
                    Expiry:
                  </Text>
                  <Text>{fromBigNumber(newBoardParams.expiry, 0)}</Text>
                </Flex>
                <Flex>
                  <Text color="secondaryText" mr={2}>
                    Expiry ({Intl.DateTimeFormat().resolvedOptions().timeZone}):
                  </Text>
                  <Text>{formatDateTime(newBoardParams.expiry.toNumber())}</Text>
                </Flex>
                <Flex my={2}>
                  <Text color="secondaryText" mr={2}>
                    Base IV:
                  </Text>
                  <Text>{fromBigNumber(newBoardParams.baseIV)}</Text>
                </Flex>
                <Text color="secondaryText">Listings:</Text>
              </Box>
              <Table data={rows} columns={columns} />
            </>
          ) : null}
          <Button
            mx={[8, 4]}
            mt={2}
            isDisabled={isAddBoardDisabled}
            onClick={async () => {
              if (tx) {
                await execute(tx)
                setIsOpen(false)
              }
            }}
            variant="primary"
            label="Confirm"
          />
        </CardBody>
      </Modal>
    </Card>
  )
}

export default AdminMarketAddBoard

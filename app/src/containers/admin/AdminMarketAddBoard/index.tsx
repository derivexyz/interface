import { BigNumber } from '@ethersproject/bignumber'
import { PopulatedTransaction } from '@ethersproject/contracts'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Input from '@lyra/ui/components/Input'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Modal from '@lyra/ui/components/Modal'
import Spinner from '@lyra/ui/components/Spinner'
import Table, { TableCellProps, TableColumn, TableData } from '@lyra/ui/components/Table'
import Text from '@lyra/ui/components/Text'
import formatDateTime from '@lyra/ui/utils/formatDateTime'
import { BoardParams, Market } from '@lyrafinance/lyra-js'
import React, { useMemo, useState } from 'react'

import { UNIT, ZERO_BN } from '@/app/constants/bn'
import useAdmin from '@/app/hooks/admin/useAdmin'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAdminTransaction from '@/app/hooks/transaction/useAdminTransaction'
import useWallet from '@/app/hooks/wallet/useWallet'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  market: Market
  owner: string
  onAddBoard: () => void
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

const AdminMarketAddBoard = withSuspense(
  ({ market, owner, onAddBoard }: Props) => {
    const { isConnected, account } = useWallet()
    const admin = useAdmin(market.lyra.network)
    const [isOpen, setIsOpen] = useState(false)
    const [expiry, setExpiry] = useState<string>('')
    const [baseIv, setBaseIv] = useState<BigNumber>(ZERO_BN)
    const [listings, setListings] = useState<Listing[]>([{ strike: ZERO_BN, skew: ZERO_BN }])
    const execute = useAdminTransaction(market.lyra.network, owner)
    const expiryPlaceholder = (Date.now() / 1000).toFixed(0)
    const isAddBoardDisabled =
      !expiry ||
      isNaN(parseInt(expiry)) ||
      baseIv.isZero() ||
      listings.length === 0 ||
      listings.some(l => l.strike.isZero() || l.skew.isZero())
    const [tx, setTx] = useState<PopulatedTransaction | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [newBoardParams, setNewBoardParams] = useState<BoardParams | null>(null)

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
      <Card mx={8} mt={4}>
        <CardBody>
          <Text mb={4} variant="heading">
            Add Board
          </Text>
          <Box mb={2} mt={2}>
            <Input
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
          </Box>
          <Box my={2}>
            <BigNumberInput label="Base IV" value={baseIv} onChange={setBaseIv} placeholder={'1'} />
          </Box>
          <Box my={2} mx={2}>
            <Text>Strikes</Text>
            {Array.from(listings).map((_listing, idx) => {
              return (
                <Flex key={idx} my={2} alignItems="center">
                  <Text mr={2}>{idx + 1}.</Text>
                  <BigNumberInput
                    mr={2}
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
                    mr={2}
                  />
                  <IconButton
                    size="md"
                    isOutline
                    variant="error"
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
          </Box>
          <Flex>
            <Button
              mr={2}
              onClick={() => setListings([...listings, { strike: ZERO_BN, skew: ZERO_BN }])}
              isOutline
              leftIcon={IconType.Plus}
              label="Add Strike"
            />
            <Button
              isDisabled={isAddBoardDisabled || !isConnected}
              isLoading={isLoading}
              variant="primary"
              label="Add Board"
              leftIcon={IconType.Plus}
              onClick={async () => {
                if (!account || !admin) {
                  return
                }
                setIsLoading(true)
                const { tx, board } = await admin.addBoard(
                  market.address,
                  account,
                  !isNaN(parseInt(expiry)) ? BigNumber.from(parseInt(expiry)) : ZERO_BN,
                  baseIv,
                  listings.map(listing => listing.strike),
                  listings.map(listing => listing.skew)
                )
                setIsLoading(false)
                setTx(tx)
                setNewBoardParams(board)
                setIsOpen(!isOpen)
              }}
            />
          </Flex>
        </CardBody>
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
              onClick={() => {
                if (tx) {
                  execute(tx, {
                    onComplete: () => {
                      onAddBoard()
                      setIsOpen(false)
                    },
                  })
                }
              }}
              variant="primary"
              label="Confirm"
            />
          </CardBody>
        </Modal>
      </Card>
    )
  },
  () => (
    <Card mx={8} mt={4}>
      <CardBody>
        <Text mb={4} variant="heading">
          Add Board
        </Text>
        <Center>
          <Spinner />
        </Center>
      </CardBody>
    </Card>
  )
)

export default AdminMarketAddBoard

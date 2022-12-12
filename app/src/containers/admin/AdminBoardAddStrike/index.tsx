import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import { IconType } from '@lyra/ui/components/Icon'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Text from '@lyra/ui/components/Text'
import { Board, Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'
import { Flex } from 'rebass'

import { UNIT, ZERO_BN } from '@/app/constants/bn'
import useAdmin from '@/app/hooks/admin/useAdmin'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAdminTransaction from '@/app/hooks/transaction/useAdminTransaction'
import useWallet from '@/app/hooks/wallet/useWallet'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  market: Market
  board: Board
  owner: string
  onAddStrike: () => void
}

const AdminBoardAddStrike = withSuspense(({ board, market, owner, onAddStrike }: Props) => {
  const { account, isConnected } = useWallet()
  const admin = useAdmin()
  const [strike, setStrike] = useState<BigNumber>(ZERO_BN)
  const [skew, setSkew] = useState<BigNumber>(ZERO_BN)
  const [isLoading, setIsLoading] = useState(false)
  const execute = useAdminTransaction(owner)
  const isAddStrikeDisabled = strike.isZero() || skew.isZero()
  if (!board) {
    return null
  }
  return (
    <Card mx={8} mt={4}>
      <CardBody>
        <Text mb={4} variant="heading">
          Add Strike
        </Text>
        <Flex mt={2}>
          <BigNumberInput
            mr={2}
            flexGrow={1}
            label="Strike Price"
            value={strike}
            onChange={setStrike}
            placeholder={ZERO_BN}
          />
          <BigNumberInput flexGrow={1} label="Skew" value={skew} onChange={setSkew} mr={2} placeholder={ZERO_BN} />
          <Box width={160} ml={2}>
            <Text color="secondaryText">Vol</Text>
            <Text>{fromBigNumber(board.baseIv.mul(skew).div(UNIT) ?? board.baseIv)}</Text>
          </Box>
        </Flex>
        <Flex>
          <Button
            mt={2}
            isLoading={isLoading}
            isDisabled={isAddStrikeDisabled || !isConnected}
            label="Add Strike"
            leftIcon={IconType.Plus}
            onClick={async () => {
              if (!account || !admin) {
                return
              }
              setIsLoading(true)
              const { tx } = await admin.addStrikeToBoard(
                market.address,
                account,
                BigNumber.from(board.id),
                strike,
                skew
              )
              execute(tx, {
                onComplete: () => {
                  onAddStrike()
                  setStrike(ZERO_BN)
                  setSkew(ZERO_BN)
                  setIsLoading(false)
                },
              })
            }}
          />
        </Flex>
      </CardBody>
    </Card>
  )
})

export default AdminBoardAddStrike

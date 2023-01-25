import { BigNumber } from '@ethersproject/bignumber'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Text from '@lyra/ui/components/Text'
import { Board } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'
import { Flex } from 'rebass'

import LabelItem from '@/app/components/common/LabelItem'
import { UNIT, ZERO_BN } from '@/app/constants/bn'
import { TransactionType } from '@/app/constants/screen'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminTransaction from '@/app/hooks/admin/useAdminTransaction'
import fromBigNumber from '@/app/utils/fromBigNumber'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  board: Board
}

const AdminBoardAddStrike = ({ board }: Props) => {
  const market = board.market()
  const admin = useAdmin(market.lyra.network)
  const [strike, setStrike] = useState<BigNumber>(ZERO_BN)
  const [skew, setSkew] = useState<BigNumber>(ZERO_BN)
  const execute = useAdminTransaction(market.lyra.network, market.params.owner)
  const isAddStrikeDisabled = strike.isZero() || skew.isZero()
  return (
    <Card>
      <CardBody>
        <Text mb={6} variant="heading">
          Add Strike
        </Text>
        <BigNumberInput
          mb={6}
          flexGrow={1}
          label="Strike Price"
          value={strike}
          onChange={setStrike}
          placeholder={ZERO_BN}
        />
        <BigNumberInput mb={6} flexGrow={1} label="Skew" value={skew} onChange={setSkew} placeholder={ZERO_BN} />
        <LabelItem mx={2} mb={6} label="Vol" value={fromBigNumber(board.baseIv.mul(skew).div(UNIT) ?? board.baseIv)} />
        <Flex>
          <TransactionButton
            width={200}
            transactionType={TransactionType.Admin}
            network={board.lyra.network}
            isDisabled={isAddStrikeDisabled}
            label="Add Strike"
            onClick={async () => {
              const { tx } = await admin.addStrikeToBoard(market.address, BigNumber.from(board.id), strike, skew)
              await execute(tx)
              setStrike(ZERO_BN)
              setSkew(ZERO_BN)
            }}
          />
        </Flex>
      </CardBody>
    </Card>
  )
}

export default AdminBoardAddStrike

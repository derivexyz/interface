import { BigNumber } from '@ethersproject/bignumber'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Text from '@lyra/ui/components/Text'
import { Board } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { TransactionType } from '@/app/constants/screen'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminTransaction from '@/app/hooks/admin/useAdminTransaction'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  board: Board
}

export default function AdminBoardBaseIv({ board }: Props) {
  const market = board.market()
  const admin = useAdmin(market.lyra.network)
  const [baseIv, setBaseIv] = useState(ZERO_BN)
  const execute = useAdminTransaction(market.lyra.network, board.market().params.owner)

  return (
    <Card>
      <CardBody>
        <Text mb={6} variant="cardHeading">
          Board Base IV
        </Text>
        <BigNumberInput mb={6} label="Base IV" value={baseIv} onChange={setBaseIv} placeholder={board.baseIv} />
        <Flex>
          <TransactionButton
            width={200}
            transactionType={TransactionType.Admin}
            network={market.lyra.network}
            label="Update"
            onClick={async () => {
              const tx = await admin.setBoardBaseIv(market.address, BigNumber.from(board.id), baseIv)
              await execute(tx)
              setBaseIv(ZERO_BN)
            }}
          />
        </Flex>
      </CardBody>
    </Card>
  )
}

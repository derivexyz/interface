import { BigNumber } from '@ethersproject/bignumber'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Text from '@lyra/ui/components/Text'
import formatDate from '@lyra/ui/utils/formatDate'
import { Board } from '@lyrafinance/lyra-js'
import React from 'react'

import { TransactionType } from '@/app/constants/screen'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminTransaction from '@/app/hooks/admin/useAdminTransaction'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  board: Board
}

const AdminBoardInfo = ({ board }: Props) => {
  const market = board.market()
  const admin = useAdmin(market.lyra.network)
  const execute = useAdminTransaction(market.lyra.network, market.params.owner)
  return (
    <Card>
      <CardBody>
        <Text variant="heading" mb={6}>
          Board #{board.id} - Exp. {formatDate(board.expiryTimestamp)}
        </Text>
        <Text mb={6}>Paused: {board.isPaused.toString()}</Text>
        <TransactionButton
          width={200}
          transactionType={TransactionType.Admin}
          network={board.lyra.network}
          label={board.isPaused ? 'Unpause Board' : 'Pause Board'}
          onClick={async () => {
            const tx = await admin.setBoardPaused(market.address, BigNumber.from(board.id), !board.isPaused)
            await execute(tx)
          }}
        />
      </CardBody>
    </Card>
  )
}

export default AdminBoardInfo

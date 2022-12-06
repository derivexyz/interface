import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Text from '@lyra/ui/components/Text'
import formatDateTime from '@lyra/ui/utils/formatDateTime'
import { Board, Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import useAdmin from '@/app/hooks/admin/useAdmin'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAdminTransaction from '@/app/hooks/transaction/useAdminTransaction'
import useWallet from '@/app/hooks/wallet/useWallet'

type Props = {
  market: Market
  board: Board
  owner: string
  onUpdateBoard: () => void
}

const AdminBoardInfo = withSuspense(({ board, market, owner, onUpdateBoard }: Props) => {
  const { account, isConnected } = useWallet()
  const admin = useAdmin()
  const execute = useAdminTransaction(owner)
  const [isLoading, setIsLoading] = useState(false)
  return (
    <Box px={8}>
      <Text variant="heading">Board #{board.id}</Text>
      <Text>Expires {formatDateTime(board?.expiryTimestamp)}</Text>
      <Box mt={4}>
        <Text>Frozen: {board.isPaused.toString()}</Text>
        <Button
          mt={1}
          isDisabled={!isConnected}
          isLoading={isLoading}
          variant={board.isPaused ? 'primary' : 'error'}
          label={board.isPaused ? 'Unpause Board' : 'Pause Board'}
          onClick={async () => {
            if (!account || !admin) {
              return
            }
            setIsLoading(true)
            const tx = await admin.setBoardPaused(market, account, BigNumber.from(board.id), !board.isPaused)
            execute(tx, {
              onComplete: () => {
                onUpdateBoard()
                setIsLoading(false)
              },
              onError: () => {
                setIsLoading(false)
              },
            })
          }}
        />
      </Box>
    </Box>
  )
})
export default AdminBoardInfo

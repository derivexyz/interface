import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Text from '@lyra/ui/components/Text'
import { Board, Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import useAdminTransaction from '@/app/hooks/transaction/useAdminTransaction'
import useWallet from '@/app/hooks/wallet/useWallet'

type Props = {
  market: Market
  board: Board
  owner: string
  onUpdateBoard: () => void
}

export default function AdminBoardBaseIv({ market, board, owner, onUpdateBoard }: Props) {
  const { account, isConnected } = useWallet()
  const [baseIv, setBaseIv] = useState(ZERO_BN)
  const [isLoading, setIsLoading] = useState(false)
  const execute = useAdminTransaction(owner)

  return (
    <Card mx={8} mt={4}>
      <CardBody>
        <Text mb={4} variant="heading">
          Board Base IV
        </Text>
        <Box my={2}>
          <BigNumberInput label="Base IV" value={baseIv} onChange={setBaseIv} placeholder={board.baseIv} />
        </Box>
        <Flex>
          <Button
            isDisabled={!isConnected}
            isLoading={isLoading}
            label="Update"
            onClick={() => {
              if (!account) {
                return
              }
              setIsLoading(true)
              const tx = market.setBoardBaseIv(account, BigNumber.from(board.id), baseIv)
              execute(tx, {
                onComplete: () => {
                  onUpdateBoard()
                  setBaseIv(ZERO_BN)
                  setIsLoading(false)
                },
              })
            }}
          />
        </Flex>
      </CardBody>
    </Card>
  )
}

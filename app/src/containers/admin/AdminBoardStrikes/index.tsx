import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Board } from '@lyrafinance/lyra-js'
import React from 'react'
import { useState } from 'react'

import { UNIT, ZERO_BN } from '@/app/constants/bn'
import useWallet from '@/app/hooks/account/useWallet'
import useAdmin from '@/app/hooks/admin/useAdmin'
import useAdminTransaction from '@/app/hooks/admin/useAdminTransaction'

type Props = {
  board: Board
}

const AdminBoardStrikes = ({ board }: Props) => {
  const { isConnected } = useWallet()
  const strikes = board.strikes()
  const admin = useAdmin(board.lyra.network)
  const execute = useAdminTransaction(board.lyra.network, board.market().params.owner)
  const [skewForStrike, setSkewForStrike] = useState<Record<string, BigNumber>>({})
  const [skewLoading, setSkewLoading] = useState<Record<string, boolean>>({})
  return (
    <Card>
      <CardBody>
        <Text mb={6} variant="heading">
          Edit Strikes
        </Text>
        <Box>
          {strikes.map(strike => {
            const skew = skewForStrike[strike.id] ?? ZERO_BN
            const isLoading = skewLoading[strike.id] ?? false
            return (
              <Box key={strike.id} my={[6, 4]}>
                <Flex justifyContent="space-between" flexWrap="wrap">
                  <Box>
                    <Text color="secondaryText">Strike</Text>
                    <Text ml={1} variant="bodyMedium">
                      {formatUSD(strike.strikePrice)}
                    </Text>
                  </Box>
                  <Box>
                    <Text variant="secondary" color="secondaryText">
                      Current IV
                    </Text>
                    <Text>{formatNumber(strike.iv, { minDps: 0, maxDps: 4, precision: 0.0001 })}</Text>
                  </Box>
                  <Box>
                    <Text variant="secondary" color="secondaryText">
                      Current Skew
                    </Text>
                    <Text>{formatNumber(strike.skew, { minDps: 0, maxDps: 4, precision: 0.0001 })}</Text>
                  </Box>
                  <Box mx={[0, 4]} my={[2, 0]}>
                    <Text variant="secondary" color="secondaryText">
                      Set Skew
                    </Text>
                    <Flex>
                      <BigNumberInput
                        isDisabled={isLoading}
                        flexGrow={1}
                        value={skew}
                        onChange={val => setSkewForStrike({ ...skewForStrike, [strike.id]: val })}
                        mr={2}
                        placeholder={formatNumber(strike.skew, { minDps: 0, maxDps: 4, precision: 0.0001 })}
                      />
                      <Button
                        isLoading={isLoading}
                        isDisabled={skew.isZero() || !isConnected}
                        label="Update"
                        onClick={async () => {
                          setSkewLoading({ ...skewLoading, [strike.id]: true })
                          const tx = await admin.setStrikeSkew(board.market().address, BigNumber.from(strike.id), skew)
                          await execute(tx)
                          setSkewLoading({ ...skewLoading, [strike.id]: false })
                        }}
                      />
                    </Flex>
                  </Box>
                  <Box width={160}>
                    <Text variant="secondary" color="secondaryText">
                      New IV
                    </Text>
                    <Text>
                      {formatNumber(board.baseIv.mul(skew).div(UNIT), { minDps: 0, maxDps: 4, precision: 0.0001 })}
                    </Text>
                  </Box>
                </Flex>
              </Box>
            )
          })}
        </Box>
      </CardBody>
    </Card>
  )
}

export default AdminBoardStrikes

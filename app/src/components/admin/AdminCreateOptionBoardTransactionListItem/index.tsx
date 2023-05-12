import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React from 'react'

import { UNIT } from '@/app/constants/bn'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  expiry: BigNumber
  baseIV: BigNumber
  strikePrices: BigNumber[]
  skews: BigNumber[]
  frozen: boolean
}

const AdminCreateOptionBoardTransactionListItem = ({ expiry, baseIV, strikePrices, skews, frozen }: Props) => {
  return (
    <Box>
      <Flex>
        <Text color="secondaryText">Expiry:</Text>
        <Text ml={1} color="secondaryText">
          {expiry.toNumber()}
        </Text>
      </Flex>
      <Flex>
        <Text color="secondaryText">BaseIV:</Text>
        <Text ml={1} color="secondaryText">
          {formatNumber(fromBigNumber(baseIV))}
        </Text>
      </Flex>
      <Flex>
        <Box>
          <Text color="secondaryText">Strike</Text>
          {strikePrices.map((strikePrice, idx) => (
            <Text color="secondaryText" key={idx + '-' + fromBigNumber(strikePrice)}>
              {fromBigNumber(strikePrice)}
            </Text>
          ))}
        </Box>
        <Box ml={4}>
          <Text color="secondaryText">Skew</Text>
          {skews.map((skew, idx) => (
            <Text color="secondaryText" key={idx + '-' + fromBigNumber(skew)}>
              {fromBigNumber(skew)}
            </Text>
          ))}
        </Box>
        <Box ml={4}>
          <Text color="secondaryText">Vol</Text>
          {skews.map((skew, idx) => {
            const vol = fromBigNumber(skew.mul(baseIV).div(UNIT))
            return (
              <Text color="secondaryText" key={idx + '-' + vol}>
                {vol}
              </Text>
            )
          })}
        </Box>
      </Flex>
      <Flex>
        <Text color="secondaryText">Frozen:</Text>
        <Text color="secondaryText" ml={1}>
          {frozen.toString()}
        </Text>
      </Flex>
    </Box>
  )
}

export default AdminCreateOptionBoardTransactionListItem

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
        <Text variant="secondary" color="secondaryText">
          Expiry:
        </Text>
        <Text ml={1} variant="secondary" color="secondaryText">
          {expiry.toNumber()}
        </Text>
      </Flex>
      <Flex>
        <Text variant="secondary" color="secondaryText">
          BaseIV:
        </Text>
        <Text variant="secondary" ml={1} color="secondaryText">
          {formatNumber(fromBigNumber(baseIV))}
        </Text>
      </Flex>
      <Flex>
        <Box>
          <Text variant="secondary" color="secondaryText">
            Strike
          </Text>
          {strikePrices.map((strikePrice, idx) => (
            <Text variant="secondary" color="secondaryText" key={idx + '-' + fromBigNumber(strikePrice)}>
              {fromBigNumber(strikePrice)}
            </Text>
          ))}
        </Box>
        <Box ml={4}>
          <Text variant="secondary" color="secondaryText">
            Skew
          </Text>
          {skews.map((skew, idx) => (
            <Text variant="secondary" color="secondaryText" key={idx + '-' + fromBigNumber(skew)}>
              {fromBigNumber(skew)}
            </Text>
          ))}
        </Box>
        <Box ml={4}>
          <Text variant="secondary" color="secondaryText">
            Vol
          </Text>
          {skews.map((skew, idx) => {
            const vol = fromBigNumber(skew.mul(baseIV).div(UNIT))
            return (
              <Text variant="secondary" color="secondaryText" key={idx + '-' + vol}>
                {vol}
              </Text>
            )
          })}
        </Box>
      </Flex>
      <Flex>
        <Text variant="secondary" color="secondaryText">
          Frozen:
        </Text>
        <Text variant="secondary" color="secondaryText" ml={1}>
          {frozen.toString()}
        </Text>
      </Flex>
    </Box>
  )
}

export default AdminCreateOptionBoardTransactionListItem

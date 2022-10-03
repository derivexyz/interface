import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import formatDate from '@lyra/ui/utils/formatDate'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { Position } from '@lyrafinance/lyra-js'
import React from 'react'

import fromBigNumber from '@/app/utils/fromBigNumber'

import MarketImage from '../MarketImage'

type Props = {
  position: Position
  customSize?: BigNumber
  hideSize?: boolean
}

export default function PositionItem({ position, customSize, hideSize }: Props): JSX.Element {
  return (
    <Flex alignItems="center">
      <MarketImage mr={2} name={position.marketName} size={32} />
      <Box>
        <Text variant="secondary">
          {position.marketName}&nbsp;${fromBigNumber(position.strikePrice)}&nbsp;
          {position.isCall ? 'Call' : 'Put'}
        </Text>
        <Text variant="small" color="secondaryText">
          <Text variant="smallMedium" as="span" color={position.isLong ? 'primaryText' : 'errorText'}>
            {position.isLong ? 'LONG' : 'SHORT'}
            {!hideSize ? ` ${formatNumber(customSize ?? position.size)}` : ''}
          </Text>
          {' · '}
          {formatDate(position.expiryTimestamp, true)} Exp
        </Text>
      </Box>
    </Flex>
  )
}

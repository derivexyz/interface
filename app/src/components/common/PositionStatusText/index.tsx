import Text from '@lyra/ui/components/Text'
import { Position } from '@lyrafinance/lyra-js'
import React from 'react'

type Props = {
  position: Position
}

export default function PositionStatusText({ position }: Props) {
  return (
    <Text
      color={
        position.isOpen
          ? 'primaryText'
          : position.isLiquidated
          ? 'errorText'
          : position.isSettled
          ? position.isInTheMoney
            ? 'primaryText'
            : 'errorText'
          : 'text'
      }
    >
      {position.isOpen
        ? 'Open'
        : position.isLiquidated
        ? 'Liquidated'
        : position.isSettled
        ? position.isInTheMoney
          ? 'Settled'
          : 'Expired'
        : 'Closed'}
    </Text>
  )
}

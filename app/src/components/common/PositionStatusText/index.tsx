import Text from '@lyra/ui/components/Text'
import { Position } from '@lyrafinance/lyra-js'
import React from 'react'

type Props = {
  position: Position
}

export default function PositionStatusText({ position }: Props) {
  return (
    <Text
      variant="secondary"
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
        ? 'OPEN'
        : position.isLiquidated
        ? 'LIQUIDATED'
        : position.isSettled
        ? position.isInTheMoney
          ? 'SETTLED'
          : 'EXPIRED'
        : 'CLOSED'}
    </Text>
  )
}

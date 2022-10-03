import Token from '@lyra/ui/components/Token'
import { Position } from '@lyrafinance/lyra-js'
import React from 'react'

type Props = {
  position: Position
}

export default function PositionStatusToken({ position }: Props) {
  return (
    <Token
      variant={
        position.isOpen
          ? 'primary'
          : position.isLiquidated
          ? 'warning'
          : position.isSettled
          ? position.isInTheMoney
            ? 'warning'
            : 'error'
          : 'default'
      }
      label={
        position.isOpen
          ? 'Open'
          : position.isLiquidated
          ? 'Liquidated'
          : position.isSettled
          ? position.isInTheMoney
            ? 'Settled'
            : 'Expired'
          : 'Closed'
      }
    />
  )
}

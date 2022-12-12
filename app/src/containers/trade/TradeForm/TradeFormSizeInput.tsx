import { BigNumber } from '@ethersproject/bignumber'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import { Trade } from '@lyrafinance/lyra-js'
import React from 'react'

import { MAX_BN, ZERO_BN } from '@/app/constants/bn'
import { LogEvent } from '@/app/constants/logEvents'
import getDefaultQuoteSize from '@/app/utils/getDefaultQuoteSize'
import getTradeLogData from '@/app/utils/getTradeLogData'
import logEvent from '@/app/utils/logEvent'

type Props = {
  trade: Trade
  size: BigNumber
  onChangeSize: (size: BigNumber) => void
} & MarginProps &
  Omit<LayoutProps, 'size'>

const TradeFormSizeInput = ({ trade, size, onChangeSize, ...styleProps }: Props) => {
  const isBuy = trade.isBuy
  const position = trade.position()
  const isOpen = isBuy === position?.isLong
  const sizeWithDefaults = size.gt(0) ? size : !position ? getDefaultQuoteSize(trade.market().name) : ZERO_BN
  return (
    <BigNumberInput
      {...styleProps}
      value={size}
      onChange={onChangeSize}
      placeholder={sizeWithDefaults}
      max={position && !isOpen ? position.size : MAX_BN}
      min={ZERO_BN}
      textAlign="right"
      showMaxButton={!!position && !isOpen}
      onBlur={() => logEvent(LogEvent.TradeSizeInput, getTradeLogData(trade))}
    />
  )
}

export default TradeFormSizeInput

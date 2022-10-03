import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { Option, Quote } from '@lyrafinance/lyra-js'
import React from 'react'

import TradeBoardListMobile from './TradeBoardListMobile'
import TradeBoardTableDesktop from './TradeBoardTableDesktop'

export type TradeBoardTableOrListProps = {
  quotes: {
    option: Option
    bid: Quote
    ask: Quote
  }[]
  isBuy: boolean
  isCall: boolean
  selectedOption: Option | null
  onSelectOption: (option: Option) => void
}

const TradeBoardTableOrList = (props: TradeBoardTableOrListProps): JSX.Element => {
  const isMobile = useIsMobile()
  return isMobile ? <TradeBoardListMobile {...props} /> : <TradeBoardTableDesktop {...props} />
}

export default TradeBoardTableOrList

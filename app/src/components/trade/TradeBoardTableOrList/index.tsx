import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { Board, Option } from '@lyrafinance/lyra-js'
import React from 'react'

import { OptionQuotesNullable } from '@/app/constants/contracts'

import TradeBoardListMobile from './TradeBoardListMobile'
import TradeBoardTableDesktop from './TradeBoardTableDesktop'

export type TradeBoardTableOrListProps = {
  board: Board
  quotes: OptionQuotesNullable[]
  isBuy: boolean
  selectedOption: Option | null
  onSelectOption: (option: Option) => void
}

const TradeBoardTableOrList = (props: TradeBoardTableOrListProps): JSX.Element => {
  const isMobile = useIsMobile()
  return isMobile ? <TradeBoardListMobile {...props} /> : <TradeBoardTableDesktop {...props} />
}

export default TradeBoardTableOrList

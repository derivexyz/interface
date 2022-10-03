import Modal from '@lyra/ui/components/Modal'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market, Option } from '@lyrafinance/lyra-js'
import React from 'react'

import TradeForm from '../TradeForm'

type Props = {
  isOpen: boolean
  onClose: () => void
  onTrade?: (market: Market, positionId: number) => void
  option: Option
  isBuy: boolean
  positionId?: number
}

export default function TradeFormModal({ isOpen, onClose, onTrade, option, positionId, isBuy }: Props) {
  const titleStr = `${isBuy ? 'Buy' : 'Sell'} ${option.market().baseToken.symbol} ${formatUSD(
    option.strike().strikePrice
  )} ${option.isCall ? 'Call' : 'Put'}`
  return (
    <Modal isMobileFullscreen title={titleStr} isOpen={isOpen} onClose={onClose}>
      <TradeForm option={option} positionId={positionId} onTrade={onTrade} isBuy={isBuy} hideTitle />
    </Modal>
  )
}

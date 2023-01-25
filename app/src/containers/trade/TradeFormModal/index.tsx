import Modal from '@lyra/ui/components/Modal'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Position } from '@lyrafinance/lyra-js'
import { Market, Option } from '@lyrafinance/lyra-js'
import React from 'react'

import formatTokenName from '@/app/utils/formatTokenName'

import TradeForm from '../TradeForm'

type Props = {
  isOpen: boolean
  onClose: () => void
  onTrade?: (market: Market, positionId: number) => void
  option: Option
  isBuy: boolean
  position?: Position
}

export default function TradeFormModal({ isOpen, onClose, onTrade, option, position, isBuy }: Props) {
  const titleStr = `${isBuy ? 'Buy' : 'Sell'} ${formatTokenName(option.market().baseToken)} ${formatUSD(
    option.strike().strikePrice
  )} ${option.isCall ? 'Call' : 'Put'}`
  return (
    <Modal isMobileFullscreen title={titleStr} isOpen={isOpen} onClose={onClose}>
      <TradeForm option={option} position={position} onTrade={onTrade} isBuy={isBuy} hideTitle />
    </Modal>
  )
}

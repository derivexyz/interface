import { FlexProps } from '@lyra/ui/components/Flex'
import Token from '@lyra/ui/components/Token'
import Tooltip, { TooltipElement } from '@lyra/ui/components/Tooltip'
import { LiquidityDelayReason } from '@lyrafinance/lyra-js'
import React from 'react'

import { CIRCUIT_BREAKER_DOC_URL, KEEPER_BOT_DOC_URL } from '@/app/constants/links'

type Props = {
  children?: React.ReactNode
  delayReason: LiquidityDelayReason
} & FlexProps

const getDelayReasonText = (delayReason: LiquidityDelayReason) => {
  let title = ''
  let tooltip = ''
  let label = ''
  let link = CIRCUIT_BREAKER_DOC_URL
  switch (delayReason) {
    case LiquidityDelayReason.Liquidity:
      label = 'Blocked'
      tooltip = 'Deposits and withdrawals have been temporarily blocked due to low liquidity in the vault.'
      title = 'Blocked'
      break
    case LiquidityDelayReason.Volatility:
      label = 'Blocked'
      tooltip = 'Deposits and withdrawals have been temporarily blocked due to high volatility in the vault.'
      title = 'Blocked'
      break
    case LiquidityDelayReason.Keeper:
      label = 'Pending'
      tooltip = 'Waiting for keepers to process your deposit. Keepers run every 30 minutes.'
      title = 'Pending'
      link = KEEPER_BOT_DOC_URL
      break
  }
  return {
    title,
    tooltip,
    label,
    link,
  }
}

export default function VaultCircuitBreakerToken({ children, delayReason, ...flexProps }: Props): TooltipElement {
  const { title, tooltip, label, link } = getDelayReasonText(delayReason)
  return (
    <Tooltip mb={2} alignItems="center" title={title} tooltip={tooltip} href={link} target="_blank" {...flexProps}>
      {children}
      <Token variant="warning" label={label} />
    </Tooltip>
  )
}

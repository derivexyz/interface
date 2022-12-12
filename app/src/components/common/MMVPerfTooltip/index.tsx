import { FlexProps } from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import Tooltip, { TooltipElement } from '@lyra/ui/components/Tooltip'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import React from 'react'

import { VAULTS_ABOUT_DOC_URL } from '@/app/constants/links'

type Props = {
  children: React.ReactNode
  marketName: string
  tokenPrice90DChange: number
  tokenPrice90DChangeAnnualized: number
} & FlexProps

export default function MMVPerfTooltip({
  marketName,
  tokenPrice90DChange,
  tokenPrice90DChangeAnnualized,
  children,
  ...flexProps
}: Props): TooltipElement {
  return (
    <Tooltip
      tooltip={
        <Text variant="secondary" color="secondaryText">
          The {marketName} market maker vault collects trading fees. In the last 90 days it has{' '}
          {tokenPrice90DChange >= 0 ? 'profited' : 'lost'}{' '}
          <Text as="span" color={tokenPrice90DChange >= 0 ? 'primaryText' : 'errorText'}>
            {formatPercentage(tokenPrice90DChange)}
          </Text>
          , which is{' '}
          <Text as="span" color={tokenPrice90DChangeAnnualized >= 0 ? 'primaryText' : 'errorText'}>
            {formatPercentage(tokenPrice90DChangeAnnualized)}
          </Text>{' '}
          annualized.
        </Text>
      }
      href={VAULTS_ABOUT_DOC_URL}
      showInfoIcon
      target="_blank"
      placement="top"
      title="90D Performance (Annualized)"
      {...flexProps}
    >
      {children}
    </Tooltip>
  )
}

import { FlexProps } from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import Tooltip, { TooltipElement } from '@lyra/ui/components/Tooltip'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import React from 'react'

import { VAULTS_ABOUT_DOC_URL } from '@/app/constants/links'

type Props = {
  children: React.ReactNode
  marketName: string
  tokenPrice30DChange: number
  tokenPrice30DChangeAnnualized: number
} & FlexProps

export default function MMVPerfTooltip({
  marketName,
  tokenPrice30DChange,
  tokenPrice30DChangeAnnualized,
  children,
  ...flexProps
}: Props): TooltipElement {
  return (
    <Tooltip
      tooltip={
        <Text variant="secondary" color="secondaryText">
          The {marketName} market maker vault collects trading fees. In the last 30 days it has{' '}
          {tokenPrice30DChange >= 0 ? 'profited' : 'lost'}{' '}
          <Text as="span" color={tokenPrice30DChange >= 0 ? 'primaryText' : 'errorText'}>
            {formatPercentage(tokenPrice30DChange)}
          </Text>
          , which is{' '}
          <Text as="span" color={tokenPrice30DChangeAnnualized >= 0 ? 'primaryText' : 'errorText'}>
            {formatPercentage(tokenPrice30DChangeAnnualized)}
          </Text>{' '}
          annualized.
        </Text>
      }
      href={VAULTS_ABOUT_DOC_URL}
      showInfoIcon
      target="_blank"
      placement="top"
      title="30D Performance (Annualized)"
      {...flexProps}
    >
      {children}
    </Tooltip>
  )
}

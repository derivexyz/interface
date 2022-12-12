import Card, { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import Tooltip from '@lyra/ui/components/Tooltip'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

export default function TooltipDemoCard({ ...marginProps }: MarginProps): CardElement {
  const isMobile = useIsMobile()
  return (
    <Card {...marginProps}>
      <CardSection>
        <Text variant="heading">Icon Tooltips</Text>
        <Flex my={2} alignItems="center" flexDirection={isMobile ? 'column' : 'row'}>
          <Tooltip
            title="Cooldown period"
            tooltip="There is a 14 day cooldown period to claim staked LYRA"
            href="https://www.lyra.finance"
            target="_blank"
          >
            <Icon icon={IconType.Info} />
          </Tooltip>
          <Tooltip
            ml={4}
            title="Lock period"
            tooltip="Staking rewards must be staked for a minimum of 6 months before you can claim them"
            href="https://www.lyra.finance"
            target="_blank"
          >
            <Icon icon={IconType.Lock} />
          </Tooltip>
        </Flex>
      </CardSection>
      <CardSection>
        <Text variant="heading">Text Tooltips</Text>
        <Flex my={2} alignItems="center" flexDirection={isMobile ? 'column' : 'row'}>
          <Tooltip
            title="Cooldown period"
            tooltip={<Text>There is a 14 day cooldown period to claim staked LYRA.</Text>}
            target="_blank"
          >
            <Text variant="body">Learn More</Text>
          </Tooltip>
          <Tooltip
            ml={4}
            title="Lock period"
            tooltip={<Text>Staking rewards must be staked for a minimum of 6 months before you can claim them.</Text>}
            href="lyra.finance"
            target="_blank"
          >
            <Text variant="body">What is the lock period?</Text>
          </Tooltip>
        </Flex>
      </CardSection>
    </Card>
  )
}

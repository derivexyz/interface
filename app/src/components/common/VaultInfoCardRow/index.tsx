import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Grid from '@lyra/ui/components/Grid'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import { RISK_DOC_URL, VAULTS_ABOUT_DOC_URL } from '@/app/constants/links'
import { LogEvent } from '@/app/constants/logEvents'
import logEvent from '@/app/utils/logEvent'

type Props = MarginProps

export default function VaultInfoCardRow({ ...styleProps }: Props) {
  const isMobile = useIsMobile()
  return (
    <Grid
      {...styleProps}
      sx={{
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
        gridColumnGap: isMobile ? 3 : 6,
        gridRowGap: isMobile ? 3 : 6,
      }}
    >
      <Card>
        <CardBody height="100%">
          <Icon mb={4} icon={IconType.Stack} size={30} color="primaryText" />
          <Text variant="cardHeading" mb={4}>
            About
          </Text>
          <Text color="secondaryText" mb={4}>
            Market Maker Vaults use your funds to make options markets on your chosen asset. Lyra vaults quote options
            via a supply / demand driven volatility surface, and have delta hedging capabilities to try to minimize
            market exposure.
          </Text>
          <Link
            mt="auto"
            href={VAULTS_ABOUT_DOC_URL}
            onClick={() => logEvent(LogEvent.VaultAboutLearnMoreClick)}
            target="_blank"
            showRightIcon
          >
            Learn more
          </Link>
        </CardBody>
      </Card>
      <Card>
        <CardBody height="100%">
          <Icon mb={4} icon={IconType.Flag} size={30} color="primaryText" />
          <Text variant="cardHeading" mb={4}>
            Risks
          </Text>
          <Text color="secondaryText" mb={4}>
            Interacting with the Lyra Protocol can lead to the loss of all assets that form part of a transaction due to
            risks including but not limited to: Smart Contract Risk, AMM Liquidity Provision Risk, Synthetix and GMX
            Risk, and Settlement Risk.
          </Text>
          <Link
            mt="auto"
            href={RISK_DOC_URL}
            onClick={() => logEvent(LogEvent.VaultRisksLearnMoreClick)}
            target="_blank"
            showRightIcon
          >
            Learn more
          </Link>
        </CardBody>
      </Card>
      <Card>
        <CardBody height="100%">
          <Icon mb={4} icon={IconType.Rewards} size={30} color="primaryText" />
          <Text variant="cardHeading" mb={4}>
            Rewards
          </Text>
          <Text color="secondaryText" mb={4}>
            Liquidity providers earn trading fees, collect bid-ask spreads and aim to generate market-neutral returns
            with automated delta hedging. In return, they take on options market making risk.
          </Text>
          <Link
            mt="auto"
            href={VAULTS_ABOUT_DOC_URL}
            onClick={() => logEvent(LogEvent.VaultRewardsLearnMoreClick)}
            target="_blank"
            showRightIcon
          >
            Learn more
          </Link>
        </CardBody>
      </Card>
    </Grid>
  )
}

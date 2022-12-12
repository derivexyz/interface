import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import MMVPerfTooltip from '@/app/components/common/MMVPerfTooltip'
import TokenAPYRangeText from '@/app/components/common/TokenAPYRangeText'
import VaultAPYTooltip from '@/app/components/common/VaultAPYTooltip'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVault from '@/app/hooks/vaults/useVault'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = {
  marketAddressOrName: string
} & MarginProps &
  LayoutProps

const VaultsStatsCard = withSuspense(
  ({ marketAddressOrName, ...styleProps }: Props) => {
    const vault = useVault(marketAddressOrName)
    const isMobile = useIsMobile()
    if (!vault) {
      return null
    }
    const {
      market,
      tvl,
      utilization,
      tokenPrice90DChange,
      tokenPrice90DChangeAnnualized,
      pendingDeposits,
      tradingVolume90D,
      openInterest,
      netDelta,
      minApy,
      minOpApy,
      minLyraApy,
      maxApy,
    } = vault
    return (
      <Card {...styleProps}>
        <CardBody>
          <Text mb={6} variant="heading">
            Stats
          </Text>
          <Grid sx={{ gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gridColumnGap: 6, gridRowGap: 6 }}>
            <LabelItem
              label="90D Perf. (Annualized)"
              value={
                <MMVPerfTooltip
                  mt="auto"
                  marketName={market.name}
                  tokenPrice90DChange={tokenPrice90DChange}
                  tokenPrice90DChangeAnnualized={tokenPrice90DChangeAnnualized}
                  alignItems="center"
                >
                  <Text variant="secondary" color={tokenPrice90DChange >= 0 ? 'primaryText' : 'errorText'}>
                    {formatPercentage(tokenPrice90DChangeAnnualized, tokenPrice90DChange === 0)}
                  </Text>
                </MMVPerfTooltip>
              }
            />
            <LabelItem
              label="Rewards APY"
              value={
                minApy > 0 && market.name.toLowerCase() !== 'sol' ? (
                  <VaultAPYTooltip
                    mt="auto"
                    alignItems="center"
                    marketName={market.name}
                    opApy={minOpApy}
                    lyraApy={minLyraApy}
                  >
                    <TokenAPYRangeText
                      variant="secondary"
                      color="primaryText"
                      tokenNameOrAddress={['stkLyra', 'OP']}
                      leftValue={formatPercentage(minApy, true)}
                      rightValue={formatPercentage(maxApy, true)}
                    />
                  </VaultAPYTooltip>
                ) : (
                  '-'
                )
              }
              valueColor={minApy > 0 ? 'text' : 'secondaryText'}
            />
            <LabelItem
              label="TVL"
              value={tvl > 0 ? formatTruncatedUSD(tvl) : '-'}
              valueColor={tvl > 0 ? 'text' : 'secondaryText'}
            />
            <Flex flexDirection="column">
              <Text variant="secondary" color="secondaryText" mb={2}>
                Pending Deposits
              </Text>
              <Text mt="auto" variant="secondary">
                {formatTruncatedUSD(pendingDeposits)}
              </Text>
            </Flex>
            <LabelItem
              label="Utilization"
              value={utilization > 0 ? formatPercentage(utilization, true) : '-'}
              valueColor={utilization > 0 ? 'text' : 'secondaryText'}
            />
            <LabelItem
              label="90D Volume"
              value={tradingVolume90D > 0 ? formatTruncatedUSD(tradingVolume90D) : '-'}
              valueColor={tradingVolume90D > 0 ? 'text' : 'secondaryText'}
            />
            <LabelItem
              label="Open Interest"
              value={openInterest > 0 ? formatTruncatedUSD(openInterest * fromBigNumber(market.spotPrice)) : '-'}
              valueColor={openInterest > 0 ? 'text' : 'secondaryText'}
            />
            <LabelItem label="Net Delta" value={`${netDelta > 0 ? '+' : ''}${formatNumber(netDelta, { dps: 3 })}`} />
          </Grid>
        </CardBody>
      </Card>
    )
  },
  ({ ...styleProps }) => (
    <Card {...styleProps}>
      <CardBody>
        <Text mb={6} variant="heading">
          Stats
        </Text>
        <Center height={[272, 124]}>
          <Spinner />
        </Center>
      </CardBody>
    </Card>
  )
)

export default VaultsStatsCard

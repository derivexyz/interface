import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import useTotalTradingVolume from '@/app/hooks/gql/useTotalTradingVolume'
import useTotalOpenInterest from '@/app/hooks/portfolio/useTotalOpenInterest'
import useTotalValueLocked from '@/app/hooks/portfolio/useTotalValueLocked'

type Props = MarginProps

const TotalValueLockedText = withSuspense(
  () => {
    const totalValueLocked = formatTruncatedUSD(useTotalValueLocked())
    return (
      <Text variant="heading" color="secondaryText">
        {totalValueLocked}
      </Text>
    )
  },
  () => <TextShimmer variant="heading" />
)

const TradingVolumeText = withSuspense(
  () => {
    const tradingVolume = useTotalTradingVolume()
    return (
      <Text variant="heading" color="secondaryText">
        {formatTruncatedUSD(tradingVolume)}
      </Text>
    )
  },
  () => <TextShimmer variant="heading" />
)

const OpenInterestText = withSuspense(
  () => {
    const openInterest = useTotalOpenInterest()
    const openInterestUSD = formatTruncatedUSD(openInterest)
    return (
      <Text variant="heading" color="secondaryText">
        {openInterestUSD}
      </Text>
    )
  },
  () => <TextShimmer variant="heading" />
)

const PortfolioKeyMetricsCard = ({ ...styleProps }: Props) => {
  const isMobile = useIsMobile()
  return (
    <Card justifyContent="space-between" {...styleProps}>
      <CardBody width="100%">
        <Flex py={[2, 4]} width="100%" justifyContent="space-between" flexDirection={isMobile ? 'column' : 'row'}>
          <Center flexDirection="column" width={['100%', '30%']} mb={[8, 0]}>
            <Text variant="heading2">Total Value Locked</Text>
            <TotalValueLockedText />
          </Center>
          <Center flexDirection={'column'} width={['100%', '30%']} mb={[8, 0]}>
            <Text variant="heading2">30D Volume</Text>
            <TradingVolumeText />
          </Center>
          <Center flexDirection={'column'} width={['100%', '30%']}>
            <Text variant="heading2">Open Interest</Text>
            <OpenInterestText />
          </Center>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default PortfolioKeyMetricsCard

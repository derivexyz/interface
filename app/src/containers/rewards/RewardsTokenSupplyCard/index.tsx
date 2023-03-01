import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import LinearProgress from '@lyra/ui/components/LinearProgress'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import Tooltip from '@lyra/ui/components/Tooltip'
import { MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import React from 'react'

import RowItem from '@/app/components/common/RowItem'
import withSuspense from '@/app/hooks/data/withSuspense'
import useTokenSupply from '@/app/hooks/rewards/useTokenSupply'

const RewardsTokenSupplyCard = withSuspense(
  ({ ...styleProps }: MarginProps) => {
    const supply = useTokenSupply()
    const circulatingSupplyPct = supply ? supply.totalCirculatingSupply / supply.totalSupply : 0
    return supply ? (
      <Card variant="outline" minWidth={['100%', 360]} sx={{ borderRadius: 'card' }} {...styleProps}>
        <CardBody>
          <Text variant="heading2" mb={10}>
            Circulating Supply
          </Text>
          <Flex>
            <Tooltip
              showInfoIcon
              tooltip={
                <Box width={200}>
                  <RowItem
                    label="Mainnet"
                    value={`${formatTruncatedNumber(supply.mainnetCirculatingSupply)} (${formatPercentage(
                      supply.mainnetCirculatingSupply / supply.totalSupply,
                      true
                    )})`}
                  />
                  <RowItem
                    label="Optimism"
                    value={`${formatTruncatedNumber(supply.optimismCirculatingSupply)} (${formatPercentage(
                      supply.optimismCirculatingSupply / supply.totalSupply,
                      true
                    )})`}
                  />
                  <RowItem
                    label="Arbitrum"
                    value={`${formatTruncatedNumber(supply.arbitrumCirculatingSupply)} (${formatPercentage(
                      supply.arbitrumCirculatingSupply / supply.totalSupply,
                      true
                    )})`}
                  />
                </Box>
              }
            >
              <Text>{formatNumber(supply.totalCirculatingSupply)}</Text>
            </Tooltip>
            <Text color="secondaryText" ml="auto">
              {formatNumber(supply.totalSupply)}
            </Text>
          </Flex>
          <LinearProgress my={2} color="primaryText" progress={supply.totalCirculatingSupply / supply.totalSupply} />
          <Text>{formatPercentage(circulatingSupplyPct, true)}</Text>
        </CardBody>
      </Card>
    ) : null
  },
  () => (
    <Card variant="outline" minWidth={['100%', 360]}>
      <CardBody>
        <Text variant="heading2" mb={8}>
          Circulating Supply
        </Text>
        <Flex>
          <TextShimmer />
          <Text ml="auto">{formatNumber(1_000_000_000)}</Text>
        </Flex>
        <LinearProgress my={2} color="primaryText" progress={0} />
        <TextShimmer width={40} />
      </CardBody>
    </Card>
  )
)

export default RewardsTokenSupplyCard

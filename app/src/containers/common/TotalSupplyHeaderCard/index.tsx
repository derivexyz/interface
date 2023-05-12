import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import LinearProgress from '@lyra/ui/components/LinearProgress'
import Text from '@lyra/ui/components/Text'
import Tooltip from '@lyra/ui/components/Tooltip'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import React from 'react'

import RowItem from '@/app/components/common/RowItem'
import withSuspense from '@/app/hooks/data/withSuspense'
import useTokenSupply from '@/app/hooks/rewards/useTokenSupply'

const TotalSupplyHeaderCard = withSuspense(() => {
  const supply = useTokenSupply()
  const circulatingSupplyPct = supply ? supply.totalCirculatingSupply / supply.totalSupply : 0
  return supply ? (
    <Card variant="outline" width="100%" height="100%">
      <CardBody>
        <Text variant="cardHeading" mb={10}>
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
})

export default TotalSupplyHeaderCard

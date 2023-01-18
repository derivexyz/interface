import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React, { useMemo } from 'react'

import VaultsIndexTable from '@/app/components/vaults_index/VaultsIndexTable'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultsTableData from '@/app/hooks/vaults/useVaultsTableData'
import getPagePath from '@/app/utils/getPagePath'

const MY_LIQUIDITY_CARD_HEIGHT = 350

const VaultsIndexTableCard = withSuspense(
  () => {
    const vaultData = useVaultsTableData()
    const totalLiquidityValue = useMemo(
      () => vaultData.reduce((sum, { liquidityTokenBalanceValue }) => sum + liquidityTokenBalanceValue, 0),
      [vaultData]
    )
    return (
      <Card overflow="hidden">
        <CardSection pb={0}>
          <Flex alignItems="center">
            <Flex flexDirection="column">
              <Text mb={[3, 0]} variant="heading">
                Your Liquidity
              </Text>
              <Text variant="heading">{formatUSD(totalLiquidityValue)}</Text>
            </Flex>
            <Button
              ml="auto"
              variant="light"
              size="md"
              label="History →"
              href={getPagePath({ page: PageId.VaultsHistory })}
            />
          </Flex>
        </CardSection>
        <CardSection noPadding>
          <VaultsIndexTable vaultData={vaultData} />
        </CardSection>
      </Card>
    )
  },
  () => (
    <Card height={MY_LIQUIDITY_CARD_HEIGHT}>
      <CardBody width="100%" height="100%">
        <Center height="100%">
          <Spinner />
        </Center>
      </CardBody>
    </Card>
  )
)

export default VaultsIndexTableCard

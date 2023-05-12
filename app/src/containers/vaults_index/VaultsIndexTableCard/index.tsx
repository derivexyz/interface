import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React, { useMemo } from 'react'

import VaultsIndexTable from '@/app/components/vaults_index/VaultsIndexTable'
import { PageId } from '@/app/constants/pages'
import { Vault } from '@/app/constants/vault'
import getPagePath from '@/app/utils/getPagePath'

type Props = {
  vaults: Vault[]
}

const VaultsIndexTableCard = ({ vaults }: Props) => {
  const totalLiquidityValue = useMemo(
    () => vaults.reduce((sum, { liquidityTokenBalanceValue }) => sum + liquidityTokenBalanceValue, 0),
    [vaults]
  )
  return (
    <Card overflow="hidden">
      <CardSection pb={0}>
        <Flex alignItems="center">
          <Flex flexDirection="column">
            <Text mb={[3, 0]} variant="cardHeading">
              Your Liquidity
            </Text>
            <Text variant="cardHeading">{formatUSD(totalLiquidityValue)}</Text>
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
        <VaultsIndexTable vaults={vaults} />
      </CardSection>
    </Card>
  )
}

export default VaultsIndexTableCard

import Box from '@lyra/ui/components/Box'
import { CardElement } from '@lyra/ui/components/Card'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'
import { useMemo } from 'react'

import { LatestRewardEpoch } from '@/app/hooks/rewards/useLatestRewardEpoch'

import VaultRewardsMarketCard from './VaultRewardsMarketCard'

type Props = {
  latestRewardEpochs: LatestRewardEpoch[]
} & MarginProps

const VaultsRewardsSection = ({ latestRewardEpochs: latestRewardEpochs, ...marginProps }: Props): CardElement => {
  const vaultsRewardsCards: JSX.Element[] = useMemo(
    () =>
      latestRewardEpochs.reduce(
        (marketCards, latestRewardEpoch) =>
          latestRewardEpoch
            ? [
                ...marketCards,
                ...latestRewardEpoch.global.markets
                  .filter(market => market.baseToken.symbol !== 'sSOL')
                  .map(market => (
                    <VaultRewardsMarketCard
                      key={market.address}
                      market={market}
                      globalRewardEpoch={latestRewardEpoch.global}
                      accountRewardEpoch={latestRewardEpoch.account}
                    />
                  )),
              ]
            : marketCards,
        [] as JSX.Element[]
      ),
    [latestRewardEpochs]
  )
  return (
    <Flex flexDirection="column" mt={[6, 4]}>
      <Box px={[6, 0]} mb={5}>
        <Text mb={2} variant="title">
          Vaults
        </Text>
        <Text color="secondaryText">Earn rewards by providing liquidity to a variety of pools.</Text>
      </Box>
      <Flex flexDirection="column" {...marginProps}>
        {vaultsRewardsCards}
      </Flex>
    </Flex>
  )
}

export default VaultsRewardsSection

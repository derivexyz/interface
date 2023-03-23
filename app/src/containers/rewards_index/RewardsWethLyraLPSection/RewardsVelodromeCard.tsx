import IconButton from '@lyra/ui/components/Button/IconButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import React from 'react'
import { useMemo } from 'react'

import TokenImageStack from '@/app/components/common/TokenImageStack'
import { ZERO_BN } from '@/app/constants/bn'
import { VELODROME_ADD_LIQUIDITY_URL } from '@/app/constants/links'
import { AppNetwork } from '@/app/constants/networks'
import { VelodromeStaking } from '@/app/utils/fetchVelodromeStaking'

type Props = {
  velodromeStaking: VelodromeStaking | null
} & MarginProps

export default function RewardsVelodromeCard({ velodromeStaking, ...styleProps }: Props) {
  const isMobile = useIsMobile()
  const balance = useMemo(
    () => (velodromeStaking ? velodromeStaking.lpTokenBalance * velodromeStaking.valuePerLPToken : 0),
    [velodromeStaking]
  )
  return (
    <Card href={VELODROME_ADD_LIQUIDITY_URL} target="_blank" {...styleProps}>
      <CardBody>
        <Grid
          sx={{
            gridTemplateColumns: isMobile ? '1fr 36px' : '1.8fr 1fr 1fr 0.7fr 36px',
            gridColumnGap: 4,
            alignItems: 'center',
          }}
        >
          <Flex alignItems="center">
            <TokenImageStack tokenNameOrAddresses={['usdc', 'lyra']} size={32} network={AppNetwork.Optimism} />
            <Text ml={2} variant="bodyLarge">
              USDC-LYRA LP · Optimism
            </Text>
          </Flex>
          <Flex alignItems="center">
            <Text mr={2} color="secondaryText" variant="bodyLarge">
              TVL
            </Text>
            <Text variant="bodyLarge">{formatTruncatedUSD(velodromeStaking?.tvl ?? ZERO_BN)}</Text>
          </Flex>
          <Flex>
            <Text mr={2} color="secondaryText" variant="bodyLarge">
              Your Liquidity
            </Text>
            <Text variant="bodyLarge">{formatTruncatedUSD(balance)}</Text>
          </Flex>
          <Flex ml="auto">
            <Text mr={2} color="secondaryText" variant="bodyLarge">
              APY
            </Text>
            <Text
              variant="bodyLarge"
              color={velodromeStaking && velodromeStaking.lpTokenBalance > 0 ? 'primaryText' : 'text'}
            >
              {formatPercentage(velodromeStaking?.apy ?? 0, true)}
            </Text>
          </Flex>
          <Flex ml="auto">
            <IconButton href={VELODROME_ADD_LIQUIDITY_URL} icon={IconType.ArrowUpRight} />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}

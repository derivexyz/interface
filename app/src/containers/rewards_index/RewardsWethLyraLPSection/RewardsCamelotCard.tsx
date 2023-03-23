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
import { CAMELOT_ADD_LIQUIDITY_URL } from '@/app/constants/links'
import { AppNetwork } from '@/app/constants/networks'
import { CamelotStaking } from '@/app/utils/fetchCamelotStaking'

type Props = {
  camelotStaking: CamelotStaking | null
} & MarginProps

export default function RewardsCamelotCard({ camelotStaking, ...styleProps }: Props) {
  const isMobile = useIsMobile()
  const balance = useMemo(
    () => (camelotStaking ? camelotStaking.lpTokenBalance * camelotStaking.valuePerLPToken : 0),
    [camelotStaking]
  )
  return (
    <Card href={CAMELOT_ADD_LIQUIDITY_URL} target="_blank" {...styleProps}>
      <CardBody>
        <Grid
          sx={{
            gridTemplateColumns: isMobile ? '1fr 36px' : '1.8fr 1fr 1fr 0.7fr 36px',
            gridColumnGap: 4,
            alignItems: 'center',
          }}
        >
          <Flex alignItems="center">
            <TokenImageStack tokenNameOrAddresses={['eth', 'lyra']} size={32} network={AppNetwork.Arbitrum} />
            <Text ml={2} variant="bodyLarge">
              ETH-LYRA LP · Arbitrum
            </Text>
          </Flex>
          <Flex alignItems="center">
            <Text mr={2} color="secondaryText" variant="bodyLarge">
              TVL
            </Text>
            <Text variant="bodyLarge">{formatTruncatedUSD(camelotStaking?.tvl ?? ZERO_BN)}</Text>
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
              color={camelotStaking && camelotStaking.lpTokenBalance > 0 ? 'primaryText' : 'text'}
            >
              {formatPercentage(camelotStaking?.apy ?? 0, true)}
            </Text>
          </Flex>
          <Flex ml="auto">
            <IconButton href={CAMELOT_ADD_LIQUIDITY_URL} icon={IconType.ArrowUpRight} />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}

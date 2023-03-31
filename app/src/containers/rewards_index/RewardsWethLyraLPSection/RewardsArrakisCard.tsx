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
import { useNavigate } from 'react-router-dom'

import TokenImageStack from '@/app/components/common/TokenImageStack'
import { ZERO_BN } from '@/app/constants/bn'
import { REWARDS_CARD_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { AppNetwork } from '@/app/constants/networks'
import { PageId } from '@/app/constants/pages'
import fromBigNumber from '@/app/utils/fromBigNumber'
import getPagePath from '@/app/utils/getPagePath'
import { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'

type Props = {
  arrakisStaking: ArrakisStaking | null
} & MarginProps

export default function RewardsArrakisCard({ arrakisStaking, ...styleProps }: Props) {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const liquidityValue = arrakisStaking
    ? fromBigNumber(arrakisStaking?.stakedLPTokenBalance) * arrakisStaking.lpTokenValue
    : 0
  return (
    <Card onClick={() => navigate(getPagePath({ page: PageId.RewardsArrakis }))} {...styleProps}>
      <CardBody>
        <Grid
          sx={{
            gridTemplateColumns: REWARDS_CARD_GRID_COLUMN_TEMPLATE,
            gridColumnGap: 4,
            alignItems: 'center',
          }}
        >
          <Flex alignItems="center">
            <TokenImageStack tokenNameOrAddresses={['eth', 'lyra']} size={32} network={AppNetwork.Ethereum} />
            <Text ml={2} variant="bodyLarge">
              Arrakis · Ethereum
            </Text>
          </Flex>
          {!isMobile ? (
            <>
              <Flex alignItems="center">
                <Text mr={2} color="secondaryText" variant="bodyLarge">
                  TVL
                </Text>
                <Text variant="bodyLarge">{formatTruncatedUSD(arrakisStaking?.stakedTVL ?? ZERO_BN)}</Text>
              </Flex>
              <Flex alignItems="center">
                <Text mr={2} color="secondaryText" variant="bodyLarge">
                  Your Liquidity
                </Text>
                <Text variant="bodyLarge">{formatTruncatedUSD(liquidityValue)}</Text>
              </Flex>
              <Flex alignItems="center" ml="auto">
                <Text mr={2} color="secondaryText" variant="bodyLarge">
                  APY
                </Text>
                <Text variant="bodyLarge">{formatPercentage(arrakisStaking?.apy ?? 0, true)}</Text>
              </Flex>
            </>
          ) : null}
          <Flex ml="auto">
            <IconButton href={getPagePath({ page: PageId.RewardsArrakis })} icon={IconType.ArrowRight} />
          </Flex>
        </Grid>
      </CardBody>
    </Card>
  )
}

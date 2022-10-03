import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import { IconType } from '@lyra/ui/components/Icon'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import React, { useMemo } from 'react'

import { ONE_INCH_ETH_TO_LYRA_URL } from '@/app/constants/links'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLyraAccountStaking from '@/app/hooks/rewards/useLyraAccountStaking'

type Props = MarginProps

const LyraBalanceText = withSuspense(
  (): CardElement => {
    const lyraAccountStaking = useLyraAccountStaking()
    const lyraBalance = useMemo(() => lyraAccountStaking?.lyraBalance.balance ?? 0, [lyraAccountStaking])
    return (
      <Text variant="heading" color="secondaryText">
        {formatTruncatedNumber(lyraBalance)} LYRA
      </Text>
    )
  },
  () => {
    return <TextShimmer variant="heading" />
  }
)

const NotStakedCardSection = ({ ...marginProps }: Props): CardElement => {
  const isMobile = useIsMobile()
  return (
    <CardSection
      justifyContent="space-between"
      isHorizontal={isMobile ? false : true}
      width={!isMobile ? '50%' : undefined}
      {...marginProps}
    >
      <Box>
        <Text variant="heading" mb={1}>
          Not Staked
        </Text>
        <LyraBalanceText />
      </Box>
      <Text my={8} variant="secondary" color="secondaryText">
        By staking LYRA you earn stkLYRA and OP rewards and receive boosts on your vault and trading rewards. Staked
        LYRA has a 14 day unstaking period.
      </Text>
      <Button
        width="50%"
        size="lg"
        label="LYRA on 1inch"
        rightIcon={IconType.ArrowUpRight}
        href={ONE_INCH_ETH_TO_LYRA_URL}
        target="_blank"
      />
    </CardSection>
  )
}

export default NotStakedCardSection

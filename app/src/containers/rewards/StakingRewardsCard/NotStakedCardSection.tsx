import Button from '@lyra/ui/components/Button'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import React, { useMemo } from 'react'

import { SWAP_TOKEN_1INCH_URL } from '@/app/constants/links'
import useAccountLyraBalances from '@/app/hooks/account/useAccountLyraBalances'
import withSuspense from '@/app/hooks/data/withSuspense'

type Props = MarginProps

const LyraBalanceText = withSuspense(
  (): CardElement => {
    const lyraBalances = useAccountLyraBalances()
    const lyraBalance = useMemo(() => lyraBalances.ethereumLyra.add(lyraBalances.optimismLyra), [lyraBalances])
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
      width={!isMobile ? `50%` : undefined}
      {...marginProps}
    >
      <Text variant="heading" mb={1}>
        Not Staked
      </Text>
      <LyraBalanceText />
      <Text my={8} color="secondaryText">
        By staking LYRA you earn stkLYRA rewards and receive boosts on your vault and trading rewards. Staked LYRA has a
        14 day unstaking period.
      </Text>
      <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr'], gridGap: 3 }}>
        <Button
          size="lg"
          label="LYRA on 1inch"
          rightIcon={IconType.ArrowUpRight}
          href={`${SWAP_TOKEN_1INCH_URL}/LYRA`}
          target="_blank"
        />
      </Grid>
    </CardSection>
  )
}

export default NotStakedCardSection

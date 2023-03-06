import Button from '@lyra/ui/components/Button'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import React, { useMemo } from 'react'
import { useState } from 'react'

import RewardsBridgeModal from '@/app/components/rewards/RewardsBridgeModal.tsx'
import { SWAP_TOKEN_1INCH_URL } from '@/app/constants/links'
import useAccountLyraBalances from '@/app/hooks/account/useAccountLyraBalances'
import withSuspense from '@/app/hooks/data/withSuspense'

type Props = MarginProps

const LyraBalanceText = withSuspense(
  (): CardElement => {
    const [isOpen, setIsOpen] = useState(false)
    const lyraBalances = useAccountLyraBalances()
    const { optimismLyra, arbitrumLyra, ethereumLyra } = lyraBalances
    const { l2Balance, balance } = useMemo(() => {
      const l2Balance = optimismLyra.add(arbitrumLyra)
      return {
        l2Balance,
        balance: ethereumLyra.add(l2Balance),
      }
    }, [ethereumLyra, optimismLyra, arbitrumLyra])
    return (
      <Grid sx={{ gridTemplateColumns: '2fr 1fr' }}>
        <Flex flexDirection="column">
          <Text variant="heading" mb={2}>
            Not Staked
          </Text>
          <Text variant="heading" color={balance.isZero() ? 'secondaryText' : l2Balance.gt(0) ? 'warningText' : 'text'}>
            {formatTruncatedNumber(balance)} LYRA
          </Text>
        </Flex>
        {l2Balance.gt(0) ? (
          <>
            <Button
              maxHeight={56}
              ml="auto"
              label="Bridge"
              size="lg"
              width={160}
              variant="warning"
              onClick={() => setIsOpen(true)}
            />
            <RewardsBridgeModal balances={lyraBalances} isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </>
        ) : null}
      </Grid>
    )
  },
  () => {
    return <TextShimmer variant="heading" />
  }
)

const RewardsNotStakedCardSection = ({ ...marginProps }: Props): CardElement => {
  const isMobile = useIsMobile()
  return (
    <CardSection
      justifyContent="space-between"
      isHorizontal={isMobile ? false : true}
      width={!isMobile ? `50%` : undefined}
      {...marginProps}
    >
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

export default RewardsNotStakedCardSection

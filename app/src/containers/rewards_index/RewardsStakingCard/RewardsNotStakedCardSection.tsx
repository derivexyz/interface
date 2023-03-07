import Button from '@lyra/ui/components/Button'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import { AccountLyraBalances } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'
import { useState } from 'react'

import RewardsBridgeModal from '@/app/components/rewards/RewardsBridgeModal.tsx'
import { SWAP_LYRA_1INCH_URL } from '@/app/constants/links'

type Props = {
  lyraBalances: AccountLyraBalances
}

const RewardsNotStakedCardSection = ({ lyraBalances }: Props): CardElement => {
  const isMobile = useIsMobile()

  const { optimismLyra, arbitrumLyra, ethereumLyra } = lyraBalances
  const { l2Balance, balance } = useMemo(() => {
    const l2Balance = optimismLyra.add(arbitrumLyra)
    return {
      l2Balance,
      balance: ethereumLyra.add(l2Balance),
    }
  }, [ethereumLyra, optimismLyra, arbitrumLyra])

  const [isOpen, setIsOpen] = useState(false)

  return (
    <CardSection
      justifyContent="space-between"
      isHorizontal={isMobile ? false : true}
      width={!isMobile ? `50%` : undefined}
    >
      <Flex flexDirection="column">
        <Text variant="heading" mb={2}>
          Not Staked
        </Text>
        <Text variant="heading" color={balance.isZero() ? 'secondaryText' : l2Balance.gt(0) ? 'warningText' : 'text'}>
          {formatTruncatedNumber(balance)} LYRA
        </Text>
      </Flex>
      <Text my={8} color="secondaryText">
        By staking LYRA you earn stkLYRA rewards and receive boosts on your vault and trading rewards. Staked LYRA has a
        14 day unstaking period.
      </Text>
      <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr'], gridGap: 3 }}>
        {l2Balance.gt(0) ? (
          <>
            <Button label="Bridge" size="lg" variant="warning" onClick={() => setIsOpen(true)} />
            <RewardsBridgeModal balances={lyraBalances} isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </>
        ) : null}
        <Button
          size="lg"
          label="Swap to LYRA"
          rightIcon={IconType.ArrowUpRight}
          href={SWAP_LYRA_1INCH_URL}
          target="_blank"
        />
      </Grid>
    </CardSection>
  )
}

export default RewardsNotStakedCardSection

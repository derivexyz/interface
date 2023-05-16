import Button from '@lyra/ui/components/Button'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import React, { useMemo } from 'react'
import { useState } from 'react'

import RewardsBridgeModal from '@/app/components/rewards/RewardsBridgeModal.tsx'
import { SWAP_LYRA_1INCH_URL } from '@/app/constants/links'
import { AppNetwork } from '@/app/constants/networks'
import { LyraBalances } from '@/app/utils/common/fetchLyraBalances'
import { getLyraBalanceForNetwork } from '@/app/utils/common/getLyraBalanceForNetwork'

type Props = {
  lyraBalances: LyraBalances
}

const RewardsNotStakedCardSection = ({ lyraBalances }: Props): CardElement => {
  const isMobile = useIsMobile()

  const { l2Balance, balance } = useMemo(() => {
    const l2Balance = [AppNetwork.Arbitrum, AppNetwork.Optimism].reduce(
      (sum, network) => sum + getLyraBalanceForNetwork(lyraBalances, network),
      0
    )
    const balance = l2Balance + getLyraBalanceForNetwork(lyraBalances, AppNetwork.Ethereum)
    return {
      l2Balance,
      balance,
    }
  }, [lyraBalances])

  const [isOpen, setIsOpen] = useState(false)

  return (
    <CardSection
      justifyContent="space-between"
      isHorizontal={isMobile ? false : true}
      width={!isMobile ? `50%` : undefined}
    >
      <Flex flexDirection="column">
        <Text variant="cardHeading">Not Staked</Text>
        <Text variant="cardHeading" color={balance === 0 ? 'secondaryText' : l2Balance > 0 ? 'warningText' : 'text'}>
          {formatTruncatedNumber(balance)} LYRA
        </Text>
      </Flex>
      <Text my={8} color="secondaryText">
        By staking LYRA you earn stkLYRA rewards and receive boosts on your vault and trading rewards. Staked LYRA has a
        14 day unstaking period.
      </Text>
      <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr 1fr'], gridGap: 3 }}>
        {l2Balance > 0 ? (
          <>
            <Button label="Bridge" size="lg" variant="warning" onClick={() => setIsOpen(true)} />
            <RewardsBridgeModal balances={lyraBalances} isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </>
        ) : null}
        <Button
          size="lg"
          label="Swap LYRA"
          rightIcon={IconType.ArrowUpRight}
          href={SWAP_LYRA_1INCH_URL}
          target="_blank"
        />
      </Grid>
    </CardSection>
  )
}

export default RewardsNotStakedCardSection

import Button from '@lyra/ui/components/Button'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { AccountLyraBalances, LyraStakingAccount } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'
import { useMemo } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import RewardsBridgeModal from '@/app/components/rewards/RewardsBridgeModal.tsx'
import { ZERO_BN } from '@/app/constants/bn'
import RewardsUnstakeModal from '@/app/containers/rewards_index/RewardsUnstakeModal'
import withSuspense from '@/app/hooks/data/withSuspense'
import useClaimableBalances from '@/app/hooks/rewards/useClaimableBalance'
import useClaimableStakingRewards from '@/app/hooks/rewards/useClaimableStakingRewards'
import { LatestRewardEpoch } from '@/app/hooks/rewards/useLatestRewardEpoch'

import RewardsClaimAndMigrateModal from '../RewardsClaimAndMigrateModal'
import RewardsStakeModal from '../RewardsStakeModal'
import RewardsStakingClaimModal from '../RewardsStakingClaimModal'
import RewardsStakedCardSectionButton from './RewardsStakedCardSectionButton'

type Props = {
  latestRewardEpochs: LatestRewardEpoch[]
  lyraBalances: AccountLyraBalances
  lyraStakingAccount: LyraStakingAccount | null
} & MarginProps

const StakingRewardsText = withSuspense(
  (): CardElement => {
    const claimableBalances = useClaimableBalances()
    const claimableStakingRewards = useClaimableStakingRewards()
    let claimableBalance = ZERO_BN
    if (claimableBalances.oldStkLyra.gt(ZERO_BN)) {
      claimableBalance = claimableBalances.oldStkLyra
    } else if (claimableStakingRewards) {
      claimableBalance = claimableStakingRewards
    }
    return <Text>{formatNumber(claimableBalance)} stkLYRA</Text>
  },
  () => <TextShimmer />
)

const RewardsStakedCardSection = ({
  latestRewardEpochs,
  lyraBalances,
  lyraStakingAccount,
  ...marginProps
}: Props): CardElement => {
  const [isUnstakeOpen, setIsUnstakeOpen] = useState(false)
  const [isStakeOpen, setIsStakeOpen] = useState(false)
  const [isL1ClaimOpen, setIsClaimL1Open] = useState(false)
  const [isClaimAndMigrateOpen, setIsClaimAndMigrateOpen] = useState(false)
  const [isBridgeOpen, setIsBridgeOpen] = useState(false)
  const isMobile = useIsMobile()

  const { optimismOldStkLyra, ethereumStkLyra, optimismStkLyra, arbitrumStkLyra } = lyraBalances
  const { l2Balance, balanceWithOld, balance } = useMemo(() => {
    const l2Balance = optimismStkLyra.add(arbitrumStkLyra)
    const balanceWithOld = optimismOldStkLyra.add(optimismStkLyra).add(arbitrumStkLyra).add(ethereumStkLyra)
    return {
      l2Balance,
      balanceWithOld,
      balance: l2Balance.add(ethereumStkLyra),
    }
  }, [optimismOldStkLyra, optimismStkLyra, arbitrumStkLyra, ethereumStkLyra])

  return (
    <CardSection
      justifyContent="space-between"
      isHorizontal={isMobile ? false : true}
      width={!isMobile ? `50%` : undefined}
      {...marginProps}
    >
      <Grid sx={{ gridTemplateColumns: '2fr 1fr' }}>
        <Flex flexDirection="column">
          <Text variant="heading" mb={2}>
            Staked
          </Text>
          <Text
            variant="heading"
            color={balance.isZero() ? 'secondaryText' : l2Balance.gt(0) ? 'warningText' : 'primaryText'}
          >
            {formatBalance({ balance: balanceWithOld, symbol: 'stkLYRA', decimals: 18 })}
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
              onClick={() => setIsBridgeOpen(true)}
            />
            <RewardsBridgeModal
              balances={lyraBalances}
              isOpen={isBridgeOpen}
              onClose={() => setIsBridgeOpen(false)}
              isStkLYRA
            />
          </>
        ) : null}
      </Grid>
      <Grid my={8} sx={{ gridTemplateColumns: '1fr 1fr', gridColumnGap: 4 }}>
        <LabelItem textVariant="body" label="Claimable Rewards" value={<StakingRewardsText />} />
        <LabelItem
          textVariant="body"
          label="APY"
          value={formatPercentage(latestRewardEpochs[0].global.stakingApy, true)}
        />
      </Grid>
      <RewardsStakedCardSectionButton
        onStakeOpen={() => setIsStakeOpen(true)}
        onUnstakeOpen={() => setIsUnstakeOpen(true)}
        onClaimAndMigrateOpen={() => setIsClaimAndMigrateOpen(true)}
        onClaimL1Open={() => setIsClaimL1Open(true)}
      />
      <RewardsUnstakeModal
        isOpen={isUnstakeOpen}
        onClose={() => setIsUnstakeOpen(false)}
        globalRewardEpoch={latestRewardEpochs[0].global}
        lyraBalances={lyraBalances}
        lyraStakingAccount={lyraStakingAccount}
      />
      <RewardsStakeModal
        isOpen={isStakeOpen}
        onClose={() => setIsStakeOpen(false)}
        globalRewardEpoch={latestRewardEpochs[0].global}
        lyraBalances={lyraBalances}
      />
      <RewardsClaimAndMigrateModal isOpen={isClaimAndMigrateOpen} onClose={() => setIsClaimAndMigrateOpen(false)} />
      <RewardsStakingClaimModal isOpen={isL1ClaimOpen} onClose={() => setIsClaimL1Open(false)} />
    </CardSection>
  )
}

export default RewardsStakedCardSection

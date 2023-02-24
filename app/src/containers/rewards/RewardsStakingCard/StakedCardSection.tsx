import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Grid from '@lyra/ui/components/Grid'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Link from '@lyra/ui/components/Link'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import Tooltip from '@lyra/ui/components/Tooltip'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import React, { useMemo, useState } from 'react'

import RowItem from '@/app/components/common/RowItem'
import StakeAPYTooltip from '@/app/components/common/StakeAPYTooltip'
import { ZERO_BN } from '@/app/constants/bn'
import UnstakeModal from '@/app/containers/rewards/UnstakeModal'
import useNetwork from '@/app/hooks/account/useNetwork'
import withSuspense from '@/app/hooks/data/withSuspense'
import useClaimableBalances from '@/app/hooks/rewards/useClaimableBalance'
import useClaimableBalancesL1 from '@/app/hooks/rewards/useClaimableBalanceL1'
import useLatestRewardEpoch from '@/app/hooks/rewards/useLatestRewardEpoch'
import useLyraAccountStaking from '@/app/hooks/rewards/useLyraAccountStaking'
import { findLyraRewardEpochToken } from '@/app/utils/findRewardToken'

import ClaimAndMigrateModal from '../ClaimAndMigrateModal'
import ClaimStakingRewardsModal from '../ClaimStakingRewardsModal'
import StakeModal from '../StakeModal'

type Props = MarginProps

type StakedCardSectionButtonProps = {
  onStakeOpen: () => void
  onUnstakeOpen: () => void
  onClaimL1Open: () => void
  onClaimAndMigrateOpen: () => void
}

const StakedLyraBalanceText = withSuspense(
  (): CardElement => {
    const lyraAccountStaking = useLyraAccountStaking()
    const { optimismOldStkLyra, optimismStkLyra, ethereumStkLyra, arbitrumStkLyra } = useMemo(() => {
      const optimismOldStkLyra = lyraAccountStaking?.lyraBalances.optimismOldStkLyra ?? ZERO_BN
      const ethereumStkLyra = lyraAccountStaking?.lyraBalances.ethereumStkLyra ?? ZERO_BN
      const optimismStkLyra = lyraAccountStaking?.lyraBalances.optimismStkLyra ?? ZERO_BN
      const arbitrumStkLyra = lyraAccountStaking?.lyraBalances.arbitrumStkLyra ?? ZERO_BN
      return {
        optimismOldStkLyra,
        optimismStkLyra,
        ethereumStkLyra,
        arbitrumStkLyra,
      }
    }, [lyraAccountStaking])
    const balance = optimismOldStkLyra.add(optimismStkLyra).add(ethereumStkLyra).add(arbitrumStkLyra)
    return (
      <Tooltip
        title="Staked LYRA"
        tooltip={
          <Box>
            <RowItem label="Ethereum" value={formatBalance(ethereumStkLyra, 'stkLYRA')} />
            {optimismStkLyra.gt(0) ? (
              <RowItem mt={3} label="Optimism" value={formatBalance(optimismStkLyra, 'stkLYRA')} />
            ) : null}
            {arbitrumStkLyra.gt(0) ? (
              <RowItem mt={3} label="Arbitrum" value={formatBalance(arbitrumStkLyra, 'stkLYRA')} />
            ) : null}
            {optimismOldStkLyra.gt(0) ? (
              <RowItem
                mt={3}
                label="To Migrate"
                valueColor="warningText"
                value={formatBalance(optimismOldStkLyra, 'stkLYRA')}
              />
            ) : null}
            {optimismOldStkLyra.gt(0) ? (
              <Text mt={3} variant="secondary" color="secondaryText">
                Migrate your staked LYRA on Optimism to a new version of staked LYRA that is native to Ethereum mainnet.
                You'll need to migrate to continue to earn boosts on your vault and trading rewards.{' '}
                <Link
                  href="https://blog.lyra.finance/lyra-staking-l1-migration/"
                  target="_blank"
                  showRightIcon
                  textVariant="secondary"
                >
                  Learn more
                </Link>
              </Text>
            ) : optimismStkLyra.gt(0) ? (
              <Text mt={3} variant="secondary" color="secondaryText">
                Bridge your stkLYRA from Optimism to Ethereum mainnet via the{' '}
                <Link
                  showRightIcon
                  textVariant="secondary"
                  href="https://app.optimism.io/bridge/withdraw"
                  target="_blank"
                >
                  Optimism Gateway
                </Link>{' '}
                to earn staking rewards.
              </Text>
            ) : null}
          </Box>
        }
        alignItems="center"
        flexDirection="row"
      >
        <Text variant="heading" color="primaryText">
          {formatBalance(balance, 'stkLYRA')}
        </Text>
        <Icon ml={1} mt={'2px'} size={16} color="secondaryText" icon={IconType.Info} />
      </Tooltip>
    )
  },
  () => {
    return <TextShimmer variant="heading" />
  }
)

const StakedLyraAPYText = withSuspense(
  () => {
    const network = useNetwork()
    const globalEpoch = useLatestRewardEpoch(network)?.global
    const stakingApyLyra = findLyraRewardEpochToken(globalEpoch?.stakingApy ?? [])
    const stakingApyTotal = globalEpoch?.stakingApy.reduce((total, apy) => total + apy.amount, 0) ?? 0
    return (
      <StakeAPYTooltip alignItems="center" lyraApy={stakingApyLyra}>
        <Text variant="secondary" color="primaryText">
          {formatPercentage(stakingApyTotal, true)}
        </Text>
      </StakeAPYTooltip>
    )
  },
  () => <TextShimmer variant="secondary" />
)

const StakingRewardsText = withSuspense(
  (): CardElement => {
    const claimableBalances = useClaimableBalances()
    const claimableBalancesL1 = useClaimableBalancesL1()
    let claimableBalance = ZERO_BN
    if (claimableBalances.oldStkLyra.gt(ZERO_BN)) {
      claimableBalance = claimableBalances.oldStkLyra
    } else if (claimableBalancesL1.newStkLyra) {
      claimableBalance = claimableBalancesL1.newStkLyra
    }
    return (
      <Text variant="secondary" color="primaryText">
        {formatNumber(claimableBalance)} stkLYRA
      </Text>
    )
  },
  () => <TextShimmer variant="secondary" />
)

const StakedCardSectionButton = withSuspense(
  ({ onStakeOpen, onUnstakeOpen, onClaimAndMigrateOpen, onClaimL1Open }: StakedCardSectionButtonProps) => {
    const claimableBalances = useClaimableBalances()
    const claimableBalancesL1 = useClaimableBalancesL1()
    const lyraAccountStaking = useLyraAccountStaking()
    const optimismOldStkLyra = lyraAccountStaking?.lyraBalances.optimismOldStkLyra ?? ZERO_BN
    const hasClaimableOldStkLyra = claimableBalances.oldStkLyra.gt(0)
    const hasOldStkLyra = optimismOldStkLyra.gt(0)
    if (hasClaimableOldStkLyra || hasOldStkLyra) {
      return (
        <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr'], gridGap: 3 }}>
          <Button size="lg" label="Migrate" variant="primary" onClick={onClaimAndMigrateOpen} />
        </Grid>
      )
    }
    return (
      <Grid
        sx={{
          gridTemplateColumns: ['1fr', claimableBalancesL1.newStkLyra.gt(ZERO_BN) ? '1fr 1fr 1fr' : '1fr 1fr'],
          gridGap: 3,
        }}
      >
        <Button size="lg" mr={2} label="Stake" variant="primary" onClick={onStakeOpen} />
        <Button size="lg" mr={2} label="Unstake" variant="default" onClick={onUnstakeOpen} />
        {claimableBalancesL1.newStkLyra.gt(ZERO_BN) ? (
          <Button
            size="lg"
            label="Claim"
            variant="primary"
            isDisabled={!claimableBalancesL1.newStkLyra.gt(ZERO_BN)}
            onClick={onClaimL1Open}
          />
        ) : null}
      </Grid>
    )
  },
  () => {
    return (
      <Grid sx={{ gridTemplateColumns: ['1r', '1fr 1fr'], gridColumnGap: 4, gridRowGap: 4 }}>
        <ButtonShimmer size="lg" width="100%" />
        <ButtonShimmer size="lg" width="100%" />
      </Grid>
    )
  }
)

const StakedCardSection = ({ ...marginProps }: Props): CardElement => {
  const [isUnstakeOpen, setIsUnstakeOpen] = useState(false)
  const [isStakeOpen, setIsStakeOpen] = useState(false)
  const [isL1ClaimOpen, setIsClaimL1Open] = useState(false)
  const [isClaimAndMigrateOpen, setIsClaimAndMigrateOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <CardSection
      justifyContent="space-between"
      isHorizontal={isMobile ? false : true}
      width={!isMobile ? `50%` : undefined}
      {...marginProps}
    >
      <Text variant="heading" mb={1}>
        Staked
      </Text>
      <StakedLyraBalanceText />
      <Grid my={8} sx={{ gridTemplateColumns: '1fr 1fr', gridColumnGap: 4 }}>
        <Box>
          <Text variant="secondary" color="secondaryText" mb={2}>
            Claimable Rewards
          </Text>
          <StakingRewardsText />
        </Box>
        <Box>
          <Text variant="secondary" color="secondaryText" mb={2}>
            APY
          </Text>
          <StakedLyraAPYText />
        </Box>
      </Grid>
      <StakedCardSectionButton
        onStakeOpen={() => setIsStakeOpen(true)}
        onUnstakeOpen={() => setIsUnstakeOpen(true)}
        onClaimAndMigrateOpen={() => setIsClaimAndMigrateOpen(true)}
        onClaimL1Open={() => setIsClaimL1Open(true)}
      />
      <UnstakeModal isOpen={isUnstakeOpen} onClose={() => setIsUnstakeOpen(false)} />
      <StakeModal isOpen={isStakeOpen} onClose={() => setIsStakeOpen(false)} />
      <ClaimAndMigrateModal isOpen={isClaimAndMigrateOpen} onClose={() => setIsClaimAndMigrateOpen(false)} />
      <ClaimStakingRewardsModal isOpen={isL1ClaimOpen} onClose={() => setIsClaimL1Open(false)} />
    </CardSection>
  )
}

export default StakedCardSection

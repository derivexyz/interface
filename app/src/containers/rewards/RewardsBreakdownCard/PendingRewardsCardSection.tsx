import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import TokenAmountTextShimmer from '@/app/components/common/TokenAmountText/TokenAmountTextShimmer'
import { PageId } from '@/app/constants/pages'
import { SECONDS_IN_HOUR } from '@/app/constants/time'
import useNetwork from '@/app/hooks/account/useNetwork'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLatestRewardEpoch from '@/app/hooks/rewards/useLatestRewardEpoch'
import { findLyraRewardEpochToken, findOpRewardEpochToken } from '@/app/utils/findRewardToken'
import getPagePath from '@/app/utils/getPagePath'

type Props = MarginProps

const PendingRewardsCardGridItems = withSuspense(
  () => {
    const network = useNetwork()
    const epochs = useLatestRewardEpoch(network)
    const account = epochs?.account
    const global = epochs?.global
    const epochEndTimestamp = global?.endTimestamp ?? 0
    const countdownTimestamp = epochEndTimestamp + SECONDS_IN_HOUR * 5
    // TODO - @dillon refactor later with better solution
    const opStakingRewards = findOpRewardEpochToken(account?.stakingRewards ?? [])
    const opVaultRewards = findOpRewardEpochToken(account?.totalVaultRewards ?? [])
    const opTradingRewards = findOpRewardEpochToken(account?.tradingRewards ?? [])
    const opShortCollatRewards = findOpRewardEpochToken(account?.shortCollateralRewards ?? [])
    const wethLyraStakingL2Rewards = findOpRewardEpochToken(account?.wethLyraStakingL2.rewards ?? [])
    const opRewards =
      opStakingRewards + opVaultRewards + opTradingRewards + opShortCollatRewards + wethLyraStakingL2Rewards
    const stkLyraVaultRewards = findLyraRewardEpochToken(account?.totalVaultRewards ?? [])
    const stkLyraTradingRewards = findLyraRewardEpochToken(account?.tradingRewards ?? [])
    const stkLyraShortCollatRewards = findLyraRewardEpochToken(account?.shortCollateralRewards ?? [])
    const stkLyraRewards = stkLyraVaultRewards + stkLyraTradingRewards + stkLyraShortCollatRewards

    // TODO: @dillon remove flags later
    const isDepositPeriod = global?.isDepositPeriod
    return (
      <>
        <Box>
          <Text variant="secondary" color="secondaryText" mb={2}>
            Pending Rewards
          </Text>
          {opRewards > 0 ? (
            <TokenAmountText tokenNameOrAddress="op" variant="secondary" amount={isDepositPeriod ? 0 : opRewards} />
          ) : null}
          <TokenAmountText
            tokenNameOrAddress="lyra"
            variant="secondary"
            amount={isDepositPeriod ? 0 : stkLyraRewards}
          />
        </Box>
        <Box>
          <Text variant="secondary" color="secondaryText" mb={2}>
            {Date.now() / 1000 > epochEndTimestamp ? 'Claimable In' : 'Countdown'}
          </Text>
          <Countdown timestamp={countdownTimestamp} fallback="Waiting for Rewards" variant="secondary" />
        </Box>
      </>
    )
  },
  () => {
    return (
      <>
        <Box>
          <TextShimmer variant="secondary" mb={2} />
          <TokenAmountTextShimmer variant="secondary" width={150} />
        </Box>
      </>
    )
  }
)

const PendingStakedLyraText = withSuspense(
  () => {
    const network = useNetwork()
    const epochs = useLatestRewardEpoch(network)
    const account = epochs?.account
    // TODO: @dillon remove next epoch
    const isDepositPeriod = epochs?.global.isDepositPeriod
    const lyraVaultRewards = findLyraRewardEpochToken(account?.totalVaultRewards ?? [])
    const lyraTradingRewards = findLyraRewardEpochToken(account?.tradingRewards ?? [])
    const lyraShortCollatRewards = findLyraRewardEpochToken(account?.shortCollateralRewards ?? [])
    const lyraRewards = lyraVaultRewards + lyraTradingRewards + lyraShortCollatRewards
    return (
      <Text variant="heading" color="secondaryText">
        {formatNumber(isDepositPeriod ? 0 : lyraRewards)} LYRA
      </Text>
    )
  },
  () => {
    return <TextShimmer variant="heading" />
  }
)

const PendingRewardsCardSection = ({ ...marginProps }: Props): CardElement => {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  return (
    <CardSection
      justifyContent="space-between"
      isHorizontal={isMobile ? false : true}
      isVertical
      width={!isMobile ? '50%' : undefined}
      {...marginProps}
    >
      <Box>
        <Text variant="heading" mb={1}>
          Pending
        </Text>
        <PendingStakedLyraText />
      </Box>
      <Grid my={8} sx={{ gridTemplateColumns: '1fr 1fr', gridColumnGap: 4 }}>
        <PendingRewardsCardGridItems />
      </Grid>
      <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr'], gridColumnGap: 4, gridRowGap: 4 }}>
        <Button
          size="lg"
          label="History"
          rightIcon={IconType.ArrowRight}
          onClick={() => navigate(getPagePath({ page: PageId.RewardsHistory }))}
          target="_blank"
        />
      </Grid>
    </CardSection>
  )
}

export default PendingRewardsCardSection

import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Grid from '@lyra/ui/components/Grid'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import React, { useMemo, useState } from 'react'

import StakeAPYTooltip from '@/app/components/common/StakeAPYTooltip'
import TokenAmountText from '@/app/components/common/TokenAmountText'
import TokenAmountTextShimmer from '@/app/components/common/TokenAmountText/TokenAmountTextShimmer'
import { ZERO_BN } from '@/app/constants/bn'
import UnstakeModal from '@/app/containers/rewards/UnstakeModal'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLatestRewardEpochs from '@/app/hooks/rewards/useLatestRewardEpochs'
import useLyraAccountStaking from '@/app/hooks/rewards/useLyraAccountStaking'
import useLyraStaking from '@/app/hooks/rewards/useLyraStaking'
import fromBigNumber from '@/app/utils/fromBigNumber'

import StakeModal from '../StakeModal'

type Props = MarginProps

const StakedLyraBalanceText = withSuspense(
  (): CardElement => {
    const lyraAccountStaking = useLyraAccountStaking()
    const stakedLyraBalance = useMemo(
      () => lyraAccountStaking?.stakedLyraBalance.balance ?? ZERO_BN,
      [lyraAccountStaking]
    )
    return (
      <Text variant="heading" color="primaryText">
        {formatNumber(stakedLyraBalance)} stkLYRA
      </Text>
    )
  },
  () => {
    return <TextShimmer variant="heading" />
  }
)

const StakedCardGridItems = withSuspense(
  () => {
    const lyraStaking = useLyraStaking()
    const globalEpoch = useLatestRewardEpochs()?.global
    const stakingApy = globalEpoch ? globalEpoch.stakingApy : null
    const totalStakedLyraSupply = fromBigNumber(lyraStaking?.totalSupply ?? ZERO_BN)

    return (
      <>
        <Box>
          <Text variant="secondary" color="secondaryText" mb={2}>
            Total Staked
          </Text>
          <TokenAmountText
            tokenNameOrAddress="stkLyra"
            variant="secondary"
            isTruncated
            amount={totalStakedLyraSupply}
          />
        </Box>
        <Box>
          <Text variant="secondary" color="secondaryText" mb={2}>
            APY
          </Text>
          <StakeAPYTooltip alignItems="center" opApy={stakingApy?.op ?? 0} lyraApy={stakingApy?.lyra ?? 0}>
            <Text variant="secondary" color="primaryText">
              {stakingApy ? formatPercentage(stakingApy.total, true) : 'Something went wrong'}
            </Text>
          </StakeAPYTooltip>
        </Box>
      </>
    )
  },
  () => {
    return (
      <Box>
        <TextShimmer variant="secondary" mb={2} />
        <TokenAmountTextShimmer variant="secondary" width={150} />
      </Box>
    )
  }
)

const StakedCardSection = ({ ...marginProps }: Props): CardElement => {
  const [isUnstakeOpen, setIsUnstakeOpen] = useState(false)
  const [isStakeOpen, setIsStakeOpen] = useState(false)
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
          Staked
        </Text>
        <StakedLyraBalanceText />
      </Box>
      <Grid my={8} sx={{ gridTemplateColumns: '1fr 1fr', gridColumnGap: 4 }}>
        <StakedCardGridItems />
      </Grid>
      <Grid sx={{ gridTemplateColumns: ['1r', '1fr 1fr'], gridColumnGap: 4, gridRowGap: 4 }}>
        <Button size="lg" label="Stake" variant="primary" onClick={() => setIsStakeOpen(true)} />
        <Button size="lg" label="Unstake" variant="default" onClick={() => setIsUnstakeOpen(true)} />
      </Grid>
      <UnstakeModal isOpen={isUnstakeOpen} onClose={() => setIsUnstakeOpen(false)} />
      <StakeModal isOpen={isStakeOpen} onClose={() => setIsStakeOpen(false)} />
    </CardSection>
  )
}

export default StakedCardSection

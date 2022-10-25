import Box from '@lyra/ui/components/Box'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React, { useMemo } from 'react'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import TokenAmountTextShimmer from '@/app/components/common/TokenAmountText/TokenAmountTextShimmer'
import { ZERO_BN } from '@/app/constants/bn'
import withSuspense from '@/app/hooks/data/withSuspense'
import usePositionHistory from '@/app/hooks/position/usePositionHistory'
import useLatestRewardEpochs from '@/app/hooks/rewards/useLatestRewardEpochs'
import fromBigNumber from '@/app/utils/fromBigNumber'

type Props = MarginProps

const ShortCollateralRewardsCardGrid = withSuspense(
  ({ ...styleProps }: MarginProps) => {
    const epochs = useLatestRewardEpochs()
    const positions = usePositionHistory(true)
    const globalRewardEpoch = epochs?.global
    const accountRewardEpoch = epochs?.account
    const { lyra: lyraRewardsCap, op: opRewardsCap } = globalRewardEpoch?.tradingRewardsCap ?? { lyra: 0, op: 0 }
    const { lyra: lyraRewards, op: opRewards } = accountRewardEpoch?.shortCollateralRewards ?? {
      lyra: 0,
      op: 0,
    }

    const shortPositions = useMemo(() => {
      if (!globalRewardEpoch) {
        return []
      }
      return (
        positions
          // Consider open positions or positions closed this epoch
          .filter(p => !p.isLong && (!p.closeTimestamp || p.closeTimestamp > globalRewardEpoch.startTimestamp))
      )
    }, [globalRewardEpoch, positions])

    const shortCollateralValue = useMemo(() => {
      return shortPositions.reduce((sum, position) => {
        return sum.add(position.collateral?.value ?? ZERO_BN)
      }, ZERO_BN)
    }, [shortPositions])

    const { lyra: lyraYieldPerDay, op: opYieldPerDay } = useMemo(() => {
      if (!globalRewardEpoch) {
        return { lyra: 0, op: 0 }
      }
      return shortPositions.reduce(
        (sum, position) => {
          const { lyra, op } = globalRewardEpoch.shortCollateralYieldPerDay(
            fromBigNumber(position.size),
            fromBigNumber(position.delta),
            position.expiryTimestamp,
            position.marketName
          )
          return { lyra: sum.lyra + lyra, op: sum.op + op }
        },
        { lyra: 0, op: 0 }
      )
    }, [shortPositions, globalRewardEpoch])

    return (
      <Grid
        {...styleProps}
        sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr 1fr'], gridColumnGap: 4, gridRowGap: 6 }}
      >
        <Flex flexDirection="column">
          <Text variant="secondary" color="secondaryText">
            Short Collateral
          </Text>
          <Text variant="secondary" mt={2}>
            {formatUSD(shortCollateralValue)}
          </Text>
        </Flex>
        <Flex flexDirection="column">
          <Text mb={2} variant="secondary" color="secondaryText">
            Short Yield / Day
          </Text>
          <Flex alignItems="center">
            <TokenAmountText variant="secondary" tokenNameOrAddress="stkLyra" amount={lyraYieldPerDay} />
            <Text variant="secondary" mx={2}>
              ·
            </Text>
            <TokenAmountText variant="secondary" tokenNameOrAddress="OP" amount={opYieldPerDay} />
          </Flex>
        </Flex>
        {lyraRewardsCap > 0 ? (
          <Flex flexDirection="column" justifyContent="space-between">
            <Text variant="secondary" color="secondaryText" mb={2}>
              Pending stkLYRA
            </Text>
            <TokenAmountText variant="secondary" tokenNameOrAddress="stkLyra" amount={lyraRewards} />
          </Flex>
        ) : null}
        {opRewardsCap > 0 ? (
          <Flex flexDirection="column" justifyContent="space-between">
            <Text variant="secondary" color="secondaryText" mb={2}>
              Pending OP
            </Text>
            <TokenAmountText variant="secondary" tokenNameOrAddress="op" amount={opRewards} />
          </Flex>
        ) : null}
      </Grid>
    )
  },
  ({ ...styleProps }: MarginProps) => {
    return (
      <Box {...styleProps}>
        <TextShimmer variant="secondary" mb={2} />
        <TokenAmountTextShimmer variant="secondary" width={150} />
      </Box>
    )
  }
)

const ShortCollateralRewardsCardSection = ({ ...marginProps }: Props): CardElement => {
  return (
    <CardSection {...marginProps}>
      <Text mb={8} variant="heading">
        Short Rewards
      </Text>
      <ShortCollateralRewardsCardGrid mb={8} />
      <Text maxWidth={['100%', '75%']} variant="secondary" color="secondaryText">
        Lyra's shorting program rewards traders for selling calls and puts with Staked LYRA and OP tokens every 2 weeks.
        This program is not subject to boosts.
      </Text>
    </CardSection>
  )
}

export default ShortCollateralRewardsCardSection

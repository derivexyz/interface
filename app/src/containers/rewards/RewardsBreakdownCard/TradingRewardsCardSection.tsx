import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React, { useState } from 'react'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import TokenAmountTextShimmer from '@/app/components/common/TokenAmountText/TokenAmountTextShimmer'
import useNetwork from '@/app/hooks/account/useNetwork'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLatestRewardEpoch from '@/app/hooks/rewards/useLatestRewardEpoch'
import { findLyraRewardEpochToken, findOpRewardEpochToken } from '@/app/utils/findRewardToken'

import FeeRebateModal from '../../common/FeeRebateModal'

type Props = MarginProps

const TradingRewardsCardGrid = withSuspense(
  ({ ...styleProps }: Props) => {
    const network = useNetwork()
    const epochs = useLatestRewardEpoch(network)
    const globalRewardEpoch = epochs?.global
    const accountRewardEpoch = epochs?.account
    const tradingFees = accountRewardEpoch?.tradingFees ?? 0
    const minTradingFeeRebate = globalRewardEpoch?.minTradingFeeRebate ?? 0
    const tradingFeeRebate = accountRewardEpoch?.tradingFeeRebate ?? minTradingFeeRebate
    const lyraRewardsCap = findLyraRewardEpochToken(globalRewardEpoch?.tradingRewardsCap ?? [])
    const opRewardsCap = findOpRewardEpochToken(globalRewardEpoch?.tradingRewardsCap ?? [])
    const lyraRewards = findLyraRewardEpochToken(accountRewardEpoch?.tradingRewards ?? [])
    const opRewards = findOpRewardEpochToken(accountRewardEpoch?.tradingRewards ?? [])

    // TODO: @dillon remove next epoch
    const isDepositPeriod = globalRewardEpoch?.isDepositPeriod

    return (
      <Grid
        {...styleProps}
        sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr 1fr'], gridColumnGap: 4, gridRowGap: 6 }}
      >
        <Flex flexDirection="column">
          <Text variant="secondary" color="secondaryText">
            Total Fees
          </Text>
          <Text variant="secondary" mt={2}>
            {formatUSD(tradingFees)}
          </Text>
        </Flex>
        <Flex flexDirection="column">
          <Text variant="secondary" color="secondaryText">
            Fee Rebate
          </Text>
          <Text variant="secondary" color="primaryText" mt={2}>
            {formatPercentage(tradingFeeRebate, true)}
          </Text>
        </Flex>
        {lyraRewardsCap > 0 ? (
          <Flex flexDirection="column" justifyContent="space-between">
            <Text variant="secondary" color="secondaryText" mb={2}>
              Pending stkLYRA
            </Text>
            <TokenAmountText
              variant="secondary"
              tokenNameOrAddress="stkLyra"
              amount={isDepositPeriod ? 0 : lyraRewards}
            />
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

const TradingRewardsCardSection = ({ ...marginProps }: MarginProps): CardElement => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <CardSection {...marginProps}>
      <Text mb={8} variant="heading">
        Trading Rewards
      </Text>
      <TradingRewardsCardGrid mb={6} />
      <Flex mb={6}>
        <Button label="View Fee Tiers" onClick={() => setIsOpen(true)} />
      </Flex>
      <Text maxWidth={['100%', '75%']} variant="secondary" color="secondaryText">
        Lyra's fee rebate program allows traders to earn back part of their fees as Staked LYRA and OP tokens every 2
        weeks. Traders can stake LYRA to unlock a higher fee rebate tier.
      </Text>
      <FeeRebateModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </CardSection>
  )
}

export default TradingRewardsCardSection

import { BigNumber } from '@ethersproject/bignumber'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Shimmer from '@lyra/ui/components/Shimmer'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import { MarginProps } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import { Market } from '@lyrafinance/lyra-js'
import React, { useEffect, useMemo } from 'react'
import { Flex } from 'rebass'

import AmountUpdateText from '@/app/components/common/AmountUpdateText'
import { ZERO_BN } from '@/app/constants/bn'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLyraAccountStaking from '@/app/hooks/rewards/useLyraAccountStaking'
import useMarkets from '@/app/hooks/rewards/useMarkets'
import useUnstake from '@/app/hooks/rewards/useUnstake'
import { findLyraRewardEpochToken, findOpRewardEpochToken } from '@/app/utils/findRewardToken'
import toBigNumber from '@/app/utils/toBigNumber'

import TokenImage from '../../common/TokenImage'
import UnstakeCardBodyButton from './UnstakeCardBodyButton'

type UnstakeCardBodyBottomSectionProps = {
  amount: BigNumber
  vault: Market | null
  setVault: (vault: Market) => void
  onClose: () => void
} & LayoutProps &
  MarginProps

const UnstakeCardBodyBottomSection = withSuspense(
  ({ vault, amount, setVault, onClose, ...styleProps }: UnstakeCardBodyBottomSectionProps) => {
    const markets = useMarkets()
    useEffect(() => {
      if (!vault) {
        setVault(markets[0])
      }
    }, [markets, vault, setVault])
    const unstake = useUnstake(amount)
    const lyraAccountStaking = useLyraAccountStaking()
    const currentTimestamp = useMemo(() => markets[0].block.timestamp, [markets])
    const unstakeWindowEndTimestamp = lyraAccountStaking?.unstakeWindowEndTimestamp ?? 0
    const { lyraStakingYieldPerDay, opStakingYieldPerDay, newLyraStakingYieldPerDay, newOpStakingYieldPerDay } =
      useMemo(() => {
        const lyraStakingYieldPerDay = findLyraRewardEpochToken(unstake?.stakingYieldPerDay ?? [])
        const opStakingYieldPerDay = findOpRewardEpochToken(unstake?.stakingYieldPerDay ?? [])
        const newLyraStakingYieldPerDay = findLyraRewardEpochToken(unstake?.newStakingYieldPerDay ?? [])
        const newOpStakingYieldPerDay = findOpRewardEpochToken(unstake?.newStakingYieldPerDay ?? [])
        return {
          lyraStakingYieldPerDay,
          opStakingYieldPerDay,
          newLyraStakingYieldPerDay,
          newOpStakingYieldPerDay,
        }
      }, [unstake])

    return (
      <CardSection {...styleProps}>
        <Flex width="100%" my={4} alignItems="center">
          <Text variant="body" color="secondaryText">
            Staking Yield / Day
          </Text>
          <Flex flexDirection="column" ml="auto">
            <Flex>
              <TokenImage nameOrAddress="lyra" />
              <AmountUpdateText
                prevAmount={toBigNumber(lyraStakingYieldPerDay) ?? ZERO_BN}
                newAmount={toBigNumber(newLyraStakingYieldPerDay) ?? ZERO_BN}
                variant="body"
                color={newLyraStakingYieldPerDay < lyraStakingYieldPerDay ? 'errorText' : 'secondaryText'}
                ml={2}
              />
            </Flex>
            <Flex mt={2}>
              <TokenImage nameOrAddress="op" />
              <AmountUpdateText
                prevAmount={toBigNumber(opStakingYieldPerDay) ?? ZERO_BN}
                newAmount={toBigNumber(newOpStakingYieldPerDay) ?? ZERO_BN}
                variant="body"
                color={newOpStakingYieldPerDay < opStakingYieldPerDay ? 'errorText' : 'secondaryText'}
                ml={2}
              />
            </Flex>
          </Flex>
        </Flex>
        {unstakeWindowEndTimestamp > currentTimestamp ? (
          <Flex width="100%" mb={8} alignItems="center" justifyContent="space-between">
            <Text variant="body" color="secondaryText">
              Time to Unstake ends in
            </Text>
            <Countdown timestamp={unstakeWindowEndTimestamp} showSeconds fallback="Less than 2 days" ml="auto" />
          </Flex>
        ) : null}
        <UnstakeCardBodyButton amount={amount} onClose={onClose} />
      </CardSection>
    )
  },
  ({ vault, amount, setVault, onClose, ...styleProps }: UnstakeCardBodyBottomSectionProps) => {
    return (
      <CardSection {...styleProps}>
        <Flex width="100%" my={4} alignItems="center">
          <Text variant="body" color="secondaryText">
            Staking Yield / Day
          </Text>
          <Flex flexDirection="column" ml="auto">
            <TextShimmer variant="body" />
            <TextShimmer variant="body" />
          </Flex>
        </Flex>
        <Flex width="100%" mb={8} alignItems="center">
          <Shimmer height={30} width={150} />
          <TextShimmer variant="body" ml="auto" />
        </Flex>
        <ButtonShimmer width="100%" size="lg" />
      </CardSection>
    )
  }
)

export default UnstakeCardBodyBottomSection

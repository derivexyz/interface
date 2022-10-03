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
import VaultsSelector from '@/app/components/common/VaultSelector'
import { ZERO_BN } from '@/app/constants/bn'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarkets from '@/app/hooks/market/useMarkets'
import useLyraAccountStaking from '@/app/hooks/rewards/useLyraAccountStaking'
import useUnstake from '@/app/hooks/rewards/useUnstake'
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
    const {
      vaultApy,
      newVaultApy,
      lyraStakingYieldPerDay,
      opStakingYieldPerDay,
      newLyraStakingYieldPerDay,
      newOpStakingYieldPerDay,
    } = useMemo(() => {
      const lyraStakingYieldPerDay = unstake?.stakingYieldPerDay.lyra ?? 0
      const opStakingYieldPerDay = unstake?.stakingYieldPerDay.op ?? 0
      const newLyraStakingYieldPerDay = unstake?.newStakingYieldPerDay.lyra ?? 0
      const newOpStakingYieldPerDay = unstake?.newStakingYieldPerDay.op ?? 0
      const vaultApy = vault?.address ? unstake?.vaultApy(vault?.address ?? '').total ?? 0 : 0
      const newVaultApy = vault?.address ? unstake?.newVaultApy(vault?.address ?? '').total ?? 0 : 0
      return {
        lyraStakingYieldPerDay,
        opStakingYieldPerDay,
        newLyraStakingYieldPerDay,
        newOpStakingYieldPerDay,
        vaultApy,
        newVaultApy,
      }
    }, [unstake, vault])

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
        <Flex width="100%" mb={8}>
          <VaultsSelector size="md" vaults={markets} onChangeVault={setVault} selectedVault={vault} ml={-2} />
          <Flex ml="auto" alignItems="center">
            <TokenImage size={20} nameOrAddress="OP" />
            <TokenImage ml={-2} mt={2} mr={1} size={24} nameOrAddress="stkLyra" />
            <AmountUpdateText
              isPercentFormat
              prevAmount={toBigNumber(vaultApy) ?? ZERO_BN}
              newAmount={toBigNumber(newVaultApy) ?? ZERO_BN}
              variant="body"
              color={newVaultApy < vaultApy ? 'errorText' : 'secondaryText'}
            />
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

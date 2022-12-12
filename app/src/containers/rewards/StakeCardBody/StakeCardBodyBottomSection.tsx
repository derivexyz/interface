import { BigNumber } from '@ethersproject/bignumber'
import ModalSection from '@lyra/ui/components/Modal/ModalSection'
import Shimmer from '@lyra/ui/components/Shimmer'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { Market } from '@lyrafinance/lyra-js'
import React, { useEffect } from 'react'
import { Flex } from 'rebass'

import TokenAmountText from '@/app/components/common/TokenAmountText'
import TokenAmountTextShimmer from '@/app/components/common/TokenAmountText/TokenAmountTextShimmer'
import { ZERO_BN } from '@/app/constants/bn'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarkets from '@/app/hooks/market/useMarkets'
import useStake from '@/app/hooks/rewards/useStake'

import VaultsSelector from '../../../components/common/VaultSelector'
import StakeFormButton from './StakeCardBodyButton'

type StakeCardBodyBottomSectionProps = {
  amount: BigNumber
  vault: Market | null
  setVault: (vault: Market) => void
  onClose: () => void
} & LayoutProps &
  MarginProps

const StakeCardBodyBottomSection = withSuspense(
  ({ vault, amount, setVault, onClose, ...styleProps }: StakeCardBodyBottomSectionProps) => {
    const markets = useMarkets()
    useEffect(() => {
      if (!vault) {
        setVault(markets[0])
      }
    }, [markets, vault, setVault])
    const stake = useStake(amount)
    const newLyraStakingYieldPerDay = stake?.newStakingYieldPerDay.lyra ?? 0
    const newOpStakingYieldPerDay = stake?.newStakingYieldPerDay.op ?? 0
    const newVaultApy = vault && stake ? stake.newVaultApy(vault.address).total : 0
    const newVaultApyMultiplier = vault && stake ? stake.newVaultApyMultiplier(vault.address) : 1
    const newTradingFeeRebate = stake ? stake.newTradingFeeRebate : 0
    const minTradingFeeRebate = stake ? stake.globalEpoch.minTradingFeeRebate : 0
    const newTradingFeeRebateDelta = newTradingFeeRebate - minTradingFeeRebate
    const newStakedLyraBalanceDelta = (stake?.newStakedLyraBalance ?? ZERO_BN).sub(stake?.stakedLyraBalance ?? ZERO_BN)
    return (
      <ModalSection {...styleProps}>
        <Flex mb={6} alignItems="center" justifyContent="space-between">
          <Text color="secondaryText">Staking Yield / Day</Text>
          <Flex>
            <TokenAmountText
              tokenNameOrAddress="stkLyra"
              amount={newLyraStakingYieldPerDay}
              color={newStakedLyraBalanceDelta.gt(0) ? 'primaryText' : 'text'}
              isTruncated
            />
            <TokenAmountText
              ml={3}
              tokenNameOrAddress="OP"
              amount={newOpStakingYieldPerDay}
              color={newStakedLyraBalanceDelta.gt(0) ? 'primaryText' : 'text'}
              isTruncated
            />
          </Flex>
        </Flex>
        <Flex mb={4} justifyContent="space-between">
          <Text color="secondaryText">Fee Rebate</Text>
          <Text color={newStakedLyraBalanceDelta.gt(0) ? 'primaryText' : 'text'}>
            {formatPercentage(newTradingFeeRebate, true)}
          </Text>
        </Flex>
        <Flex mb={6} justifyContent="space-between" alignItems="center">
          <VaultsSelector size="md" vaults={markets} onChangeVault={setVault} selectedVault={vault} ml={-2} />
          <Text color={newStakedLyraBalanceDelta.gt(0) ? 'primaryText' : 'text'}>
            {formatPercentage(newVaultApy, true)}{' '}
            {newVaultApyMultiplier > 1 ? `(${formatNumber(newVaultApyMultiplier)}x)` : ''}
          </Text>
        </Flex>
        <StakeFormButton amount={amount} onClose={onClose} />
      </ModalSection>
    )
  },
  ({ vault, amount, setVault, onClose, ...styleProps }: StakeCardBodyBottomSectionProps) => {
    return (
      <ModalSection {...styleProps}>
        <Flex width="100%" my={4} alignItems="center" justifyContent="space-between">
          <Text variant="body" color="secondaryText">
            Staking Yield / Day
          </Text>
          <TokenAmountTextShimmer width={120} />
        </Flex>
        <Flex width="100%" mb={8} alignItems="center" justifyContent="space-between">
          <Shimmer height={36} width={150} />
          <TextShimmer />
        </Flex>
        <ButtonShimmer width="100%" size="lg" />
      </ModalSection>
    )
  }
)

export default StakeCardBodyBottomSection

import { BigNumber } from '@ethersproject/bignumber'
import Button from '@lyra/ui/components/Button'
import { IconType } from '@lyra/ui/components/Icon'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { Network } from '@lyrafinance/lyra-js'
import React, { useCallback } from 'react'
import { Flex } from 'rebass'

import { WETH_LYRA_L2_LIQUIDITY_URL } from '@/app/constants/links'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccountWethLyraStakingL2, {
  useMutateAccountWethLyraStakingL2,
} from '@/app/hooks/rewards/useAccountWethLyraStakingL2'
import { lyraOptimism } from '@/app/utils/lyra'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  amount: BigNumber
  onChange: (val: BigNumber) => void
  onUnstake: () => void
}

const WethLyraL2UnstakeModalContent = withSuspense(
  ({ amount, onChange, onUnstake }: Props) => {
    const accountWethLyraStaking = useAccountWethLyraStakingL2()
    const mutateAccountWethLyraStakingL2 = useMutateAccountWethLyraStakingL2()
    const execute = useTransaction(Network.Optimism)
    const account = useWalletAccount()
    const isDisabled = amount.isZero() || accountWethLyraStaking?.stakedLPTokenBalance.isZero()

    const handleClickUnstake = useCallback(async () => {
      if (account) {
        const tx = await lyraOptimism.account(account).unstakeWethLyraL2(amount)
        execute(tx, {
          onComplete: () => {
            mutateAccountWethLyraStakingL2()
            onUnstake()
          },
        })
      }
    }, [account, amount, execute, mutateAccountWethLyraStakingL2, onUnstake])

    return (
      <>
        <Flex mb={4} alignItems="center">
          <Text color="secondaryText">Staked Balance</Text>
          <Text ml="auto">{formatNumber(accountWethLyraStaking?.stakedLPTokenBalance ?? 0)} LP Tokens</Text>
        </Flex>
        <Flex mb={8} alignItems="center">
          <Text color="secondaryText">Amount to Unstake</Text>
          <BigNumberInput
            ml="auto"
            textAlign="right"
            width="50%"
            value={amount}
            onChange={onChange}
            max={accountWethLyraStaking?.stakedLPTokenBalance}
            showMaxButton
          />
        </Flex>
        <TransactionButton
          network={Network.Optimism}
          transactionType={TransactionType.UnstakeWethLyraL2}
          width="100%"
          mb={3}
          isDisabled={isDisabled}
          label="Unstake"
          onClick={handleClickUnstake}
        />
        <Button
          width="100%"
          label="Remove Liquidity"
          rightIcon={IconType.ArrowUpRight}
          size="lg"
          href={WETH_LYRA_L2_LIQUIDITY_URL + '/remove'} // TODO: @dillon LEAP-44 update this link
          target="_blank"
        />
      </>
    )
  },
  () => (
    <>
      <Flex alignItems="center">
        <Text color="secondaryText">Staked Balance</Text>
        <TextShimmer ml="auto" />
      </Flex>
      <Flex mt={4} alignItems="center">
        <Text color="secondaryText">Amount to Unstake</Text>
        <ButtonShimmer width="50%" ml="auto" />
      </Flex>
      <ButtonShimmer mt={8} width="100%" size="lg" />
      <ButtonShimmer mt={4} width="100%" size="lg" />
    </>
  )
)

export default WethLyraL2UnstakeModalContent

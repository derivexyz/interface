import { BigNumber } from '@ethersproject/bignumber'
import Button from '@lyra/ui/components/Button'
import { IconType } from '@lyra/ui/components/Icon'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React, { useCallback, useState } from 'react'
import { Flex } from 'rebass'

import { ARRAKIS_LIQUIDITY_URL } from '@/app/constants/links'
import { TransactionType } from '@/app/constants/screen'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccountWethLyraStaking, {
  useMutateAccountWethLyraStaking,
} from '@/app/hooks/rewards/useAccountWethLyraStaking'
import useTransaction from '@/app/hooks/transaction/useTransaction'
import useWalletAccount from '@/app/hooks/wallet/useWalletAccount'
import lyra from '@/app/utils/lyra'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  amount: BigNumber
  onChange: (val: BigNumber) => void
  onUnstake: () => void
}

const WethLyraUnstakeModalContent = withSuspense(
  ({ amount, onChange, onUnstake }: Props) => {
    const accountWethLyraStaking = useAccountWethLyraStaking()
    const [isLoading, setIsLoading] = useState(false)
    const mutateAccountWethLyraStaking = useMutateAccountWethLyraStaking()
    const execute = useTransaction()
    const account = useWalletAccount()
    const isDisabled = amount.isZero() || accountWethLyraStaking?.stakedLPTokenBalance.isZero()

    const handleClickUnstake = useCallback(async () => {
      if (account) {
        setIsLoading(true)
        const tx = await lyra.account(account).unstakeWethLyra(amount)
        execute(tx, {
          onComplete: () => {
            mutateAccountWethLyraStaking()
            setIsLoading(false)
            onUnstake()
          },
          onError: () => {
            setIsLoading(false)
          },
        })
      }
    }, [account, amount, execute, mutateAccountWethLyraStaking, onUnstake])

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
          sx={{ mb: 3, width: '100%' }}
          transactionType={TransactionType.UnstakeWethLyra}
          variant={accountWethLyraStaking?.stakedLPTokenBalance.gt(0) ? 'primary' : 'default'}
          size="lg"
          isDisabled={isDisabled}
          isLoading={isLoading}
          label="Unstake"
          onClick={handleClickUnstake}
        />
        <Button
          width="100%"
          label="Remove Liquidity"
          rightIcon={IconType.ArrowUpRight}
          size="lg"
          href={ARRAKIS_LIQUIDITY_URL + '/remove'}
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

export default WethLyraUnstakeModalContent

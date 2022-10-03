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
  onStake: () => void
}

const WethLyraStakeModalContent = withSuspense(
  ({ amount, onChange, onStake }: Props) => {
    const accountWethLyraStaking = useAccountWethLyraStaking()
    const [isLoading, setIsLoading] = useState(false)
    const mutateAccountWethLyraStaking = useMutateAccountWethLyraStaking()
    const execute = useTransaction()
    const account = useWalletAccount()
    const isApprove =
      accountWethLyraStaking?.unstakedLPTokenBalance.gt(0) && accountWethLyraStaking?.allowance.lt(amount)
    const isDisabled = amount.lte(0) || accountWethLyraStaking?.unstakedLPTokenBalance.eq(0)
    const handleClickStake = useCallback(async () => {
      if (account) {
        setIsLoading(true)
        const tx = await lyra.account(account).stakeWethLyra(amount)
        await execute(tx, {
          onComplete: async () => {
            await mutateAccountWethLyraStaking()
            setIsLoading(false)
            onStake()
          },
          onError: () => {
            setIsLoading(false)
          },
        })
      }
    }, [account, amount, execute, mutateAccountWethLyraStaking, onStake])

    const handleClickApprove = useCallback(async () => {
      if (account) {
        setIsLoading(true)
        const tx = await lyra.account(account).approveWethLyraTokens()
        execute(tx, {
          onComplete: async () => {
            await mutateAccountWethLyraStaking()
            setIsLoading(false)
          },
          onError: () => {
            setIsLoading(false)
          },
        })
      }
    }, [account, execute, mutateAccountWethLyraStaking])

    return (
      <>
        <Flex mb={4} alignItems="center">
          <Text color="secondaryText">Stakeable Balance</Text>
          <Text ml="auto">{formatNumber(accountWethLyraStaking?.unstakedLPTokenBalance ?? 0)} LP Tokens</Text>
        </Flex>
        <Flex mb={8} alignItems="center">
          <Text color="secondaryText">Amount to Stake</Text>
          <BigNumberInput
            ml="auto"
            textAlign="right"
            width="50%"
            value={amount}
            onChange={onChange}
            max={accountWethLyraStaking?.unstakedLPTokenBalance}
            showMaxButton
          />
        </Flex>
        <TransactionButton
          transactionType={TransactionType.StakeWethLyra}
          helperButton={
            <Button
              width="100%"
              label="Add Liquidity"
              rightIcon={IconType.ArrowUpRight}
              size="lg"
              variant={accountWethLyraStaking?.unstakedLPTokenBalance.gt(0) ? 'default' : 'primary'}
              href={ARRAKIS_LIQUIDITY_URL + '/add'}
              target="_blank"
            />
          }
          sx={{ width: '100%' }}
          variant={accountWethLyraStaking?.unstakedLPTokenBalance.gt(0) ? 'primary' : 'default'}
          size="lg"
          isDisabled={!isApprove && isDisabled}
          isLoading={isLoading}
          label={isApprove ? 'Allow Lyra to stake your LP Tokens' : 'Stake'}
          onClick={async () => {
            if (isApprove) {
              await handleClickApprove()
              return
            }
            await handleClickStake()
          }}
        />
      </>
    )
  },
  () => (
    <>
      <Flex alignItems="center">
        <Text color="secondaryText">Stakeable Balance</Text>
        <TextShimmer ml="auto" />
      </Flex>
      <Flex mt={4} alignItems="center">
        <Text color="secondaryText">Amount to Stake</Text>
        <ButtonShimmer width="50%" ml="auto" />
      </Flex>
      <ButtonShimmer mt={8} width="100%" size="lg" />
      <ButtonShimmer mt={4} width="100%" size="lg" />
    </>
  )
)

export default WethLyraStakeModalContent

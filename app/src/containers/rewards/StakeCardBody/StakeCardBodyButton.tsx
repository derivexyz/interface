import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { MarginProps } from '@lyra/ui/types'
import { StakeDisabledReason } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo, useState } from 'react'

import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccount from '@/app/hooks/market/useAccount'
import { useMutateAccountStaking } from '@/app/hooks/rewards/useLyraAccountStaking'
import useStake, { useMutateStake } from '@/app/hooks/rewards/useStake'
import useTransaction from '@/app/hooks/transaction/useTransaction'
import logEvent from '@/app/utils/logEvent'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  amount: BigNumber
  onClose: () => void
} & MarginProps

const StakeFormButton = withSuspense(
  ({ amount, onClose, ...styleProps }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isApprovalLoading, setIsApprovalLoading] = useState(false)
    const stake = useStake(amount)
    const account = useAccount()
    const execute = useTransaction()
    const { insufficientAllowance, insufficientBalance } = useMemo(() => {
      const insufficientAllowance = stake?.disabledReason === StakeDisabledReason.InsufficientAllowance
      const insufficientBalance = stake?.disabledReason === StakeDisabledReason.InsufficientBalance
      return {
        insufficientAllowance,
        insufficientBalance,
      }
    }, [stake])
    const mutateLyraBalances = useMutateAccountStaking()
    const mutateAccountStaking = useMutateAccountStaking()
    const mutateStake = useMutateStake(amount)
    const handleClickApprove = useCallback(async () => {
      if (!account) {
        console.warn('Account does not exist')
        return null
      }
      logEvent(LogEvent.StakeLyraApproveSubmit)
      setIsApprovalLoading(true)
      const tx = await account.approveStake()
      await execute(tx, {
        onComplete: async () => {
          logEvent(LogEvent.StakeLyraApproveSuccess)
          await Promise.all([mutateAccountStaking(), mutateLyraBalances(), mutateStake()])
        },
        onError: error => logEvent(LogEvent.StakeLyraApproveError, { error: error?.message }),
      })
      setIsApprovalLoading(false)
    }, [account, execute, mutateLyraBalances, mutateAccountStaking, mutateStake])

    const handleClickStake = useCallback(async () => {
      if (!account || !stake) {
        console.warn('Account or stake does not exist')
        return null
      }
      logEvent(LogEvent.StakeLyraSubmit, { stakeAmount: stake.amount })
      setIsLoading(true)
      if (stake.tx) {
        await execute(stake.tx, {
          onComplete: async () => {
            logEvent(LogEvent.StakeLyraSuccess, { stakeAmount: stake.amount })
            await Promise.all([mutateAccountStaking(), mutateLyraBalances(), mutateStake()])
          },
          onError: error => logEvent(LogEvent.StakeLyraError, { stakeAmount: stake.amount, error: error?.message }),
        })
      }
      setIsLoading(false)
      onClose()
    }, [account, execute, stake, onClose, mutateAccountStaking, mutateLyraBalances, mutateStake])

    const approveButtonGroup = (
      <>
        <Button
          sx={{ mb: 3, width: '100%' }}
          variant="primary"
          size="lg"
          isLoading={isApprovalLoading}
          onClick={handleClickApprove}
          label={`Allow Lyra to use your LYRA`}
        />
        <Button size="lg" width="100%" variant="primary" isDisabled label="Stake" onClick={handleClickStake} />
      </>
    )

    const stakeButton = (
      <TransactionButton
        transactionType={TransactionType.StakeLyra}
        size="lg"
        sx={{ width: '100%' }}
        variant="primary"
        isDisabled={!!stake?.disabledReason || amount.lte(0)}
        isLoading={isLoading}
        label={amount.lte(0) ? 'Enter Amount' : insufficientBalance ? 'Insufficient Balance' : 'Stake'}
        onClick={handleClickStake}
      />
    )

    return <Box {...styleProps}>{insufficientAllowance ? approveButtonGroup : stakeButton}</Box>
  },
  ({ ...styleProps }) => <ButtonShimmer size="lg" width="100%" {...styleProps} />
)
export default StakeFormButton

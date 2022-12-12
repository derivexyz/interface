import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { MarginProps } from '@lyra/ui/types'
import { UnstakeDisabledReason } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo, useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccount from '@/app/hooks/market/useAccount'
import useLyraAccountStaking, { useMutateAccountStaking } from '@/app/hooks/rewards/useLyraAccountStaking'
import useUnstake, { useMutateUnstake } from '@/app/hooks/rewards/useUnstake'
import useTransaction from '@/app/hooks/transaction/useTransaction'
import logEvent from '@/app/utils/logEvent'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  amount?: BigNumber
  onClose?: () => void
} & MarginProps

const UnstakeCardBodyButton = withSuspense(
  ({ amount, onClose, ...styleProps }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isRequestUnstakeLoading, setIsApprovalLoading] = useState(false)
    const lyraAccountStaking = useLyraAccountStaking()
    const unstake = useUnstake(amount ?? ZERO_BN)
    const account = useAccount()
    const execute = useTransaction()
    const { insufficientBalance } = useMemo(() => {
      const insufficientBalance = unstake?.disabledReason === UnstakeDisabledReason.InsufficientBalance
      const notInUnstakeWindow = unstake?.disabledReason === UnstakeDisabledReason.NotInUnstakeWindow
      return {
        insufficientBalance,
        notInUnstakeWindow,
      }
    }, [unstake])

    const mutateAccountStaking = useMutateAccountStaking()
    const mutateUnstake = useMutateUnstake()
    const handleClickRequestUnstake = useCallback(async () => {
      if (!account || !unstake) {
        console.warn('Account or unstake does not exist')
        return null
      }
      logEvent(LogEvent.UnstakeLyraSubmit, { unstakeAmount: unstake.amount })
      setIsApprovalLoading(true)
      const tx = await account.requestUnstake()
      await execute(tx, {
        onComplete: async () => {
          logEvent(LogEvent.UnstakeLyraSuccess, { unstakeAmount: unstake.amount })
          await Promise.all([mutateAccountStaking(), mutateUnstake()])
        },
        onError: error => {
          logEvent(LogEvent.UnstakeLyraError, { unstakeAmount: unstake.amount, error: error?.message })
        },
      })
      setIsApprovalLoading(false)
    }, [account, execute, mutateAccountStaking, mutateUnstake, unstake])

    const handleClickUnstake = useCallback(async () => {
      if (!account) {
        console.warn('Account does not exist')
        return null
      }
      setIsLoading(true)
      if (unstake?.tx) {
        await execute(unstake.tx, {
          onComplete: async () => await Promise.all([mutateAccountStaking(), mutateUnstake()]),
        })
      }
      setIsLoading(false)
      onClose && onClose()
    }, [account, execute, unstake, onClose, mutateAccountStaking, mutateUnstake])
    const isCooldown = !!lyraAccountStaking?.isInCooldown
    const hasUnstakeableBalance = (lyraAccountStaking?.stakedLyraBalance.balance ?? 0) <= 0

    return (
      <Box {...styleProps}>
        {!lyraAccountStaking?.isInUnstakeWindow ? (
          <TransactionButton
            transactionType={TransactionType.UnstakeLyra}
            sx={{ width: '100%' }}
            variant="primary"
            size="lg"
            isDisabled={hasUnstakeableBalance || isCooldown}
            isLoading={isRequestUnstakeLoading}
            onClick={handleClickRequestUnstake}
            label={isCooldown ? `Requested Unstake` : `Request Unstake`}
          />
        ) : (
          <TransactionButton
            transactionType={TransactionType.UnstakeLyra}
            size="lg"
            sx={{ width: '100%' }}
            variant="primary"
            isDisabled={insufficientBalance || amount?.lte(0)}
            isLoading={isLoading}
            label={amount?.lte(0) ? 'Enter Amount' : insufficientBalance ? 'Insufficient Balance' : 'Unstake'}
            onClick={handleClickUnstake}
          />
        )}
      </Box>
    )
  },
  ({ ...styleProps }) => <ButtonShimmer size="lg" width="100%" {...styleProps} />
)
export default UnstakeCardBodyButton

import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { MarginProps } from '@lyra/ui/types'
import { Network, UnstakeDisabledReason } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccount from '@/app/hooks/market/useAccount'
import useLyraAccountStaking, { useMutateAccountStaking } from '@/app/hooks/rewards/useLyraAccountStaking'
import useUnstake from '@/app/hooks/rewards/useUnstake'
import logEvent from '@/app/utils/logEvent'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  amount?: BigNumber
  onClose?: () => void
} & MarginProps

const UnstakeCardBodyButton = withSuspense(
  ({ amount, onClose, ...styleProps }: Props) => {
    const lyraAccountStaking = useLyraAccountStaking()
    const unstake = useUnstake(amount ?? ZERO_BN)
    const account = useAccount(Network.Optimism)
    const execute = useTransaction(Network.Optimism)
    const { insufficientBalance } = useMemo(() => {
      const insufficientBalance = unstake?.disabledReason === UnstakeDisabledReason.InsufficientBalance
      const notInUnstakeWindow = unstake?.disabledReason === UnstakeDisabledReason.NotInUnstakeWindow
      return {
        insufficientBalance,
        notInUnstakeWindow,
      }
    }, [unstake])

    const mutateAccountStaking = useMutateAccountStaking()
    const handleClickRequestUnstake = useCallback(async () => {
      if (!account || !unstake) {
        console.warn('Account or unstake does not exist')
        return
      }
      logEvent(LogEvent.UnstakeLyraSubmit, { unstakeAmount: unstake.amount })
      const tx = await account.requestUnstake()
      await execute(tx, {
        onComplete: async () => {
          logEvent(LogEvent.UnstakeLyraSuccess, { unstakeAmount: unstake.amount })
          await Promise.all([mutateAccountStaking()])
        },
        onError: error => {
          logEvent(LogEvent.UnstakeLyraError, { unstakeAmount: unstake.amount, error: error?.message })
        },
      })
    }, [account, execute, mutateAccountStaking, unstake])

    const handleClickUnstake = useCallback(async () => {
      if (!account) {
        console.warn('Account does not exist')
        return
      }
      if (unstake?.tx) {
        await execute(unstake.tx, {
          onComplete: async () => await Promise.all([mutateAccountStaking()]),
        })
      }
      onClose && onClose()
    }, [account, execute, unstake, onClose, mutateAccountStaking])
    const isCooldown = !!lyraAccountStaking?.isInCooldown
    const hasUnstakeableBalance = (lyraAccountStaking?.lyraBalances.ethereumStkLyra ?? 0) <= 0
    return (
      <Box {...styleProps}>
        {!lyraAccountStaking?.isInUnstakeWindow ? (
          <TransactionButton
            network={'ethereum'}
            transactionType={TransactionType.UnstakeLyra}
            width="100%"
            isDisabled={hasUnstakeableBalance || isCooldown}
            onClick={handleClickRequestUnstake}
            label={isCooldown ? `Requested Unstake` : `Request Unstake`}
          />
        ) : (
          <TransactionButton
            network={'ethereum'}
            transactionType={TransactionType.UnstakeLyra}
            width="100%"
            isDisabled={insufficientBalance || amount?.lte(0)}
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

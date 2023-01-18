import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { MarginProps } from '@lyra/ui/types'
import { Network, StakeDisabledReason } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo } from 'react'

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
    const stake = useStake(amount)
    const account = useAccount(Network.Optimism)
    const execute = useTransaction('ethereum')
    const { insufficientAllowance, insufficientBalance } = useMemo(() => {
      const insufficientAllowance = stake?.disabledReason === StakeDisabledReason.InsufficientAllowance
      const insufficientBalance = stake?.disabledReason === StakeDisabledReason.InsufficientBalance
      return {
        insufficientAllowance,
        insufficientBalance,
      }
    }, [stake])
    const mutateAccountStaking = useMutateAccountStaking()
    const mutateStake = useMutateStake(amount)
    const handleClickApprove = useCallback(async () => {
      if (!account) {
        console.warn('Account does not exist')
        return null
      }
      logEvent(LogEvent.StakeLyraApproveSubmit)
      const tx = await account.approveStake()
      await execute(tx, {
        onComplete: async () => {
          logEvent(LogEvent.StakeLyraApproveSuccess)
          await Promise.all([mutateAccountStaking(), mutateStake()])
        },
        onError: error => logEvent(LogEvent.StakeLyraApproveError, { error: error?.message }),
      })
    }, [account, execute, mutateAccountStaking, mutateStake])

    const handleClickStake = useCallback(async () => {
      if (!account || !stake) {
        console.warn('Account or stake does not exist')
        return
      }
      logEvent(LogEvent.StakeLyraSubmit, { stakeAmount: stake.amount })
      if (stake.tx) {
        await execute(stake.tx, {
          onComplete: async () => {
            logEvent(LogEvent.StakeLyraSuccess, { stakeAmount: stake.amount })
            await Promise.all([mutateAccountStaking(), mutateStake()])
            onClose()
          },
          onError: error => {
            logEvent(LogEvent.StakeLyraError, { stakeAmount: stake.amount, error: error?.message })
            onClose()
          },
        })
      }
    }, [account, execute, stake, onClose, mutateAccountStaking, mutateStake])

    const stakeButton = (
      <TransactionButton
        transactionType={TransactionType.StakeLyra}
        requireAllowance={
          !insufficientBalance && insufficientAllowance
            ? {
                address: '0x01ba67aac7f75f647d94220cc98fb30fcc5105bf',
                symbol: 'LYRA',
                decimals: 18,
                onClick: handleClickApprove,
              }
            : undefined
        }
        width="100%"
        isDisabled={!!stake?.disabledReason || amount.lte(0)}
        network={'ethereum'}
        label={amount.lte(0) ? 'Enter Amount' : insufficientBalance ? 'Insufficient Balance' : 'Stake'}
        onClick={handleClickStake}
      />
    )

    return <Box {...styleProps}>{stakeButton}</Box>
  },
  ({ ...styleProps }) => <ButtonShimmer size="lg" width="100%" {...styleProps} />
)
export default StakeFormButton

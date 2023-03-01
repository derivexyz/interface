import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { MarginProps } from '@lyra/ui/types'
import React, { useCallback } from 'react'

import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import useAccountLyraBalances from '@/app/hooks/account/useAccountLyraBalances'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import withSuspense from '@/app/hooks/data/withSuspense'
import { useMutateAccountStaking } from '@/app/hooks/rewards/useLyraAccountStaking'
import { useMutateLyraStaking } from '@/app/hooks/rewards/useLyraStaking'
import logEvent from '@/app/utils/logEvent'
import { lyraOptimism } from '@/app/utils/lyra'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  amount: BigNumber
  onClose: () => void
} & MarginProps

const StakeFormButton = withSuspense(
  ({ amount, onClose, ...styleProps }: Props) => {
    const lyraBalances = useAccountLyraBalances()
    const account = useWalletAccount()
    const execute = useTransaction('ethereum')
    const insufficientBalance = lyraBalances.ethereumLyra.lt(amount)
    const mutateAccountStaking = useMutateAccountStaking()
    const mutateLyraStaking = useMutateLyraStaking()
    const handleClickApprove = useCallback(async () => {
      if (!account) {
        console.warn('Account does not exist')
        return null
      }
      logEvent(LogEvent.StakeLyraApproveSubmit)
      const tx = await lyraOptimism.approveStaking(account)
      await execute(tx, {
        onComplete: async () => {
          logEvent(LogEvent.StakeLyraApproveSuccess)
          await Promise.all([mutateAccountStaking()])
        },
        onError: error => logEvent(LogEvent.StakeLyraApproveError, { error: error?.message }),
      })
    }, [account, execute, mutateAccountStaking])

    const handleClickStake = useCallback(async () => {
      if (!account) {
        console.warn('Account or stake does not exist')
        return
      }
      logEvent(LogEvent.StakeLyraSubmit, { stakeAmount: amount })
      const tx = await lyraOptimism.stake(account, amount)
      if (tx) {
        await execute(tx, {
          onComplete: async () => {
            logEvent(LogEvent.StakeLyraSuccess, { stakeAmount: amount })
            await Promise.all([mutateAccountStaking(), mutateLyraStaking()])
            onClose()
          },
          onError: error => {
            logEvent(LogEvent.StakeLyraError, { stakeAmount: amount, error: error?.message })
            onClose()
          },
        })
      }
    }, [account, amount, execute, onClose, mutateLyraStaking, mutateAccountStaking])

    const stakeButton = (
      <TransactionButton
        transactionType={TransactionType.StakeLyra}
        requireAllowance={
          !insufficientBalance
            ? {
                address: '0x01ba67aac7f75f647d94220cc98fb30fcc5105bf',
                symbol: 'LYRA',
                decimals: 18,
                onClick: handleClickApprove,
              }
            : undefined
        }
        width="100%"
        isDisabled={amount.lte(0)}
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

import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import { MarginProps } from '@lyra/ui/types'
import { AccountLyraBalances, LyraStakingAccount, Network } from '@lyrafinance/lyra-js'
import React, { useCallback } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import { useMutateAccountLyraBalances } from '@/app/hooks/account/useAccountLyraBalances'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { useMutateRewardsPageData } from '@/app/hooks/rewards/useRewardsPageData'
import logEvent from '@/app/utils/logEvent'
import { lyraOptimism } from '@/app/utils/lyra'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  lyraBalances: AccountLyraBalances
  lyraStakingAccount: LyraStakingAccount | null
  amount?: BigNumber
  onClose?: () => void
} & MarginProps

const RewardsUnstakeModalButton = ({ amount, lyraBalances, lyraStakingAccount, onClose, ...styleProps }: Props) => {
  const account = useWalletAccount()
  const execute = useTransaction(Network.Optimism)
  const mutateRewardsPageData = useMutateRewardsPageData()
  const mutateLyraBalances = useMutateAccountLyraBalances()
  const handleClickRequestUnstake = useCallback(async () => {
    if (!account) {
      console.warn('Account or unstake does not exist')
      return
    }
    logEvent(LogEvent.UnstakeLyraSubmit, { unstakeAmount: amount })
    const tx = await lyraOptimism.requestUnstake(account)
    await execute(tx, {
      onComplete: async () => {
        logEvent(LogEvent.UnstakeLyraSuccess, { unstakeAmount: amount })
        await Promise.all([mutateRewardsPageData()])
      },
      onError: error => {
        logEvent(LogEvent.UnstakeLyraError, { unstakeAmount: amount, error: error?.message })
      },
    })
  }, [amount, account, execute, mutateRewardsPageData])

  const handleClickUnstake = useCallback(async () => {
    if (!account) {
      console.warn('Account does not exist')
      return
    }
    const tx = await lyraOptimism.unstake(account, amount ?? ZERO_BN)
    if (tx) {
      await execute(tx, {
        onComplete: async () => await Promise.all([mutateRewardsPageData(), mutateLyraBalances()]),
      })
    }
    onClose && onClose()
  }, [account, amount, execute, onClose, mutateRewardsPageData, mutateLyraBalances])

  const insufficientBalance = amount ? lyraBalances.ethereumStkLyra.lt(amount) : false
  const isCooldown = !!lyraStakingAccount?.isInCooldown
  const hasUnstakeableBalance = lyraBalances.ethereumStkLyra.lte(0)

  return (
    <Box {...styleProps}>
      {!lyraStakingAccount?.isInUnstakeWindow ? (
        <TransactionButton
          network={'ethereum'}
          transactionType={TransactionType.UnstakeLyra}
          width="100%"
          isDisabled={hasUnstakeableBalance || isCooldown}
          onClick={handleClickRequestUnstake}
          label={isCooldown ? `Unstake` : `Request Unstake`}
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
}

export default RewardsUnstakeModalButton

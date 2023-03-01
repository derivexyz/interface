import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { MarginProps } from '@lyra/ui/types'
import { Network } from '@lyrafinance/lyra-js'
import React, { useCallback } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import useAccountLyraBalances from '@/app/hooks/account/useAccountLyraBalances'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLyraStakingAccount, { useMutateAccountStaking } from '@/app/hooks/rewards/useLyraAccountStaking'
import { useMutateLyraStaking } from '@/app/hooks/rewards/useLyraStaking'
import logEvent from '@/app/utils/logEvent'
import { lyraOptimism } from '@/app/utils/lyra'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  amount?: BigNumber
  onClose?: () => void
} & MarginProps

const UnstakeCardBodyButton = withSuspense(
  ({ amount, onClose, ...styleProps }: Props) => {
    const lyraAccountStaking = useLyraStakingAccount()
    const lyraBalances = useAccountLyraBalances()
    const account = useWalletAccount()
    const execute = useTransaction(Network.Optimism)
    const mutateAccountStaking = useMutateAccountStaking()
    const mutateLyraStaking = useMutateLyraStaking()

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
          await Promise.all([mutateAccountStaking()])
        },
        onError: error => {
          logEvent(LogEvent.UnstakeLyraError, { unstakeAmount: amount, error: error?.message })
        },
      })
    }, [amount, account, execute, mutateAccountStaking])

    const handleClickUnstake = useCallback(async () => {
      if (!account) {
        console.warn('Account does not exist')
        return
      }
      const tx = await lyraOptimism.unstake(account, amount ?? ZERO_BN)
      if (tx) {
        await execute(tx, {
          onComplete: async () => await Promise.all([mutateAccountStaking(), mutateLyraStaking()]),
        })
      }
      onClose && onClose()
    }, [account, amount, execute, onClose, mutateAccountStaking, mutateLyraStaking])

    const insufficientBalance = amount ? lyraBalances.ethereumStkLyra.lte(amount) : false
    const isCooldown = !!lyraAccountStaking?.isInCooldown
    const hasUnstakeableBalance = lyraBalances.ethereumStkLyra.lte(0)

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

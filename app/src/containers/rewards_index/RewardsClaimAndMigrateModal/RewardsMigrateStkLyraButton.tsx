import Box from '@lyra/ui/components/Box'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { MarginProps } from '@lyra/ui/types'
import { LyraStaking, Network } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import useAccountLyraBalances, { useMutateAccountLyraBalances } from '@/app/hooks/account/useAccountLyraBalances'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import withSuspense from '@/app/hooks/data/withSuspense'
import logEvent from '@/app/utils/logEvent'
import { lyraOptimism } from '@/app/utils/lyra'

import TransactionButton from '../../common/TransactionButton'

type Props = MarginProps

const RewardsMigrateStkLyraButton = withSuspense(
  ({ ...styleProps }: Props) => {
    const lyraBalances = useAccountLyraBalances()
    const amount = lyraBalances.optimismOldStkLyra
    const account = useWalletAccount()
    const execute = useTransaction(Network.Optimism)
    const { insufficientAllowance, insufficientBalance } = useMemo(
      () => ({
        insufficientAllowance: lyraBalances.migrationAllowance.lte(ZERO_BN),
        insufficientBalance: lyraBalances.optimismOldStkLyra.lte(ZERO_BN),
      }),
      [lyraBalances]
    )
    const mutateAccountLyraBalances = useMutateAccountLyraBalances()
    const handleClickApprove = useCallback(async () => {
      if (!account) {
        console.warn('Account does not exist')
        return null
      }
      logEvent(LogEvent.MigrateStakeLyraApproveSubmit)
      const tx = await LyraStaking.approveMigrate(lyraOptimism, account)
      await execute(tx, TransactionType.MigrateStakedLyra, {
        onComplete: async () => {
          logEvent(LogEvent.MigrateStakeLyraApproveSuccess)
          await Promise.all([mutateAccountLyraBalances()])
        },
        onError: error => logEvent(LogEvent.MigrateStakeLyraApproveError, { error: error?.message }),
      })
    }, [account, execute, mutateAccountLyraBalances])

    const handleClickMigrate = useCallback(async () => {
      if (!account) {
        console.warn('Account does not exist')
        return
      }
      logEvent(LogEvent.MigrateStakeLyraSubmit)
      const tx = await LyraStaking.migrateStakedLyra(lyraOptimism, account)
      await execute(tx, TransactionType.MigrateStakedLyra, {
        onComplete: async () => {
          logEvent(LogEvent.MigrateStakeLyraSuccess)
          await Promise.all([mutateAccountLyraBalances()])
        },
        onError: error => logEvent(LogEvent.MigrateStakeLyraError, { error: error?.message }),
      })
    }, [account, execute, mutateAccountLyraBalances])

    const migrateButton = (
      <TransactionButton
        transactionType={TransactionType.MigrateStakedLyra}
        requireAllowance={
          !insufficientBalance && insufficientAllowance
            ? {
                address: '0xdE48b1B5853cc63B1D05e507414D3E02831722F8',
                symbol: 'stkLYRA',
                decimals: 18,
                onClick: handleClickApprove,
              }
            : undefined
        }
        sx={{ width: '100%' }}
        isDisabled={amount.lte(0)}
        network={Network.Optimism}
        label={amount.lte(0) ? 'Enter Amount' : insufficientBalance ? 'Insufficient Balance' : 'Migrate'}
        onClick={handleClickMigrate}
      />
    )
    return <Box {...styleProps}>{migrateButton}</Box>
  },
  ({ ...styleProps }) => <ButtonShimmer size="lg" width="100%" {...styleProps} />
)

export default RewardsMigrateStkLyraButton

import Box from '@lyra/ui/components/Box'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { MarginProps } from '@lyra/ui/types'
import { Network } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { LogEvent } from '@/app/constants/logEvents'
import { TransactionType } from '@/app/constants/screen'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccount from '@/app/hooks/market/useAccount'
import useLyraAccountStaking, { useMutateAccountStaking } from '@/app/hooks/rewards/useLyraAccountStaking'
import useTransaction from '@/app/hooks/transaction/useTransaction'
import logEvent from '@/app/utils/logEvent'

import TransactionButton from '../../common/TransactionButton'

type Props = MarginProps

const MigrateStkLyraButton = withSuspense(
  ({ ...styleProps }: Props) => {
    const lyraAccountStaking = useLyraAccountStaking()
    const amount = lyraAccountStaking?.lyraBalances.optimismOldStkLyra ?? ZERO_BN
    const account = useAccount(Network.Optimism)
    const execute = useTransaction(Network.Optimism)
    const { insufficientAllowance, insufficientBalance } = useMemo(() => {
      const migrationAllowance = lyraAccountStaking?.lyraAllowances.migrationAllowance ?? ZERO_BN
      const optimismOldStkLyra = lyraAccountStaking?.lyraBalances.optimismOldStkLyra ?? ZERO_BN
      const insufficientAllowance = migrationAllowance.lte(ZERO_BN)
      const insufficientBalance = optimismOldStkLyra.lte(ZERO_BN)
      return {
        insufficientAllowance,
        insufficientBalance,
      }
    }, [lyraAccountStaking])
    const mutateAccountStaking = useMutateAccountStaking()

    const handleClickApprove = useCallback(async () => {
      if (!account) {
        console.warn('Account does not exist')
        return null
      }
      logEvent(LogEvent.MigrateStakeLyraApproveSubmit)
      const tx = await account.approveMigrateStakedLyra()
      await execute(tx, {
        onComplete: async () => {
          logEvent(LogEvent.MigrateStakeLyraApproveSuccess)
          await mutateAccountStaking()
        },
        onError: error => logEvent(LogEvent.MigrateStakeLyraApproveError, { error: error?.message }),
      })
    }, [account, execute, mutateAccountStaking])

    const handleClickMigrate = useCallback(async () => {
      if (!account) {
        console.warn('Account does not exist')
        return
      }
      logEvent(LogEvent.MigrateStakeLyraSubmit)
      const tx = await account.migrateStakedLyra()
      await execute(tx, {
        onComplete: async () => {
          logEvent(LogEvent.MigrateStakeLyraSuccess)
          await mutateAccountStaking()
        },
        onError: error => logEvent(LogEvent.MigrateStakeLyraError, { error: error?.message }),
      })
    }, [account, execute, mutateAccountStaking])

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

export default MigrateStkLyraButton

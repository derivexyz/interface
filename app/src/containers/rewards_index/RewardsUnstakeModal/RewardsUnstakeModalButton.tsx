import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import { MarginProps } from '@lyra/ui/types'
import React, { useCallback } from 'react'

import { ContractId } from '@/app/constants/contracts'
import { LogEvent } from '@/app/constants/logEvents'
import { AppNetwork } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { useMutateRewardsPageData } from '@/app/hooks/rewards/useRewardsPageData'
import { LyraBalances } from '@/app/utils/common/fetchLyraBalances'
import getContract from '@/app/utils/common/getContract'
import { getLyraBalanceForNetwork, getStkLyraBalanceForNetwork } from '@/app/utils/common/getLyraBalanceForNetwork'
import fromBigNumber from '@/app/utils/fromBigNumber'
import logEvent from '@/app/utils/logEvent'
import { LyraStaking } from '@/app/utils/rewards/fetchLyraStaking'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  lyraBalances: LyraBalances
  lyraStaking: LyraStaking
  amount?: BigNumber
  onClose?: () => void
} & MarginProps

const RewardsUnstakeModalButton = ({ amount, lyraBalances, lyraStaking, onClose, ...styleProps }: Props) => {
  const account = useWalletAccount()
  const execute = useTransaction(AppNetwork.Ethereum)
  const mutateRewardsPageData = useMutateRewardsPageData()

  const handleClickRequestUnstake = useCallback(async () => {
    if (!account) {
      console.warn('Account or unstake does not exist')
      return
    }
    logEvent(LogEvent.UnstakeLyraSubmit, { unstakeAmount: amount })

    const lyraStaking = getContract(ContractId.LyraStaking, AppNetwork.Ethereum)

    await execute({ contract: lyraStaking, method: 'cooldown', params: [] }, TransactionType.UnstakeLyra, {
      onComplete: async () => {
        logEvent(LogEvent.UnstakeLyraSuccess, { unstakeAmount: amount })
        await mutateRewardsPageData()
      },
    })
  }, [amount, account, execute, mutateRewardsPageData])

  const handleClickUnstake = useCallback(async () => {
    if (!account) {
      console.warn('Account does not exist')
      return
    }

    if (!amount) {
      console.warn('Amount not defined')
      return
    }

    const lyraStaking = getContract(ContractId.LyraStaking, AppNetwork.Ethereum)

    await execute({ contract: lyraStaking, method: 'redeem', params: [account, amount] }, TransactionType.UnstakeLyra, {
      onComplete: async () => await mutateRewardsPageData(),
    })
    onClose && onClose()
  }, [account, amount, execute, onClose, mutateRewardsPageData])
  const lyraBalance = getLyraBalanceForNetwork(lyraBalances, AppNetwork.Ethereum)
  const insufficientBalance = amount ? lyraBalance < fromBigNumber(amount) : false
  const isCooldown = !!lyraStaking?.isInCooldown
  const hasUnstakeableBalance = getStkLyraBalanceForNetwork(lyraBalances, AppNetwork.Ethereum) > 0

  return (
    <Box {...styleProps}>
      {!lyraStaking?.isInUnstakeWindow ? (
        <TransactionButton
          network={AppNetwork.Ethereum}
          transactionType={TransactionType.UnstakeLyra}
          width="100%"
          isDisabled={hasUnstakeableBalance || isCooldown}
          onClick={handleClickRequestUnstake}
          label={isCooldown ? `Unstake` : `Request Unstake`}
        />
      ) : (
        <TransactionButton
          network={AppNetwork.Ethereum}
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

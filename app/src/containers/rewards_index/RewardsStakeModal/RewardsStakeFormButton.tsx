import { BigNumber } from '@ethersproject/bignumber'
import Box from '@lyra/ui/components/Box'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { MarginProps } from '@lyra/ui/types'
import React, { useCallback } from 'react'

import { MAX_BN } from '@/app/constants/bn'
import { ContractId } from '@/app/constants/contracts'
import { LogEvent } from '@/app/constants/logEvents'
import { AppNetwork } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import useAccountLyraBalances, { useMutateAccountLyraBalances } from '@/app/hooks/account/useAccountLyraBalances'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import withSuspense from '@/app/hooks/data/withSuspense'
import getContract from '@/app/utils/common/getContract'
import getERC20Contract from '@/app/utils/common/getERC20Contract'
import getTokenInfo from '@/app/utils/getTokenInfo'
import logEvent from '@/app/utils/logEvent'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  amount: BigNumber
  onClose: () => void
} & MarginProps

const LYRA_TOKEN = getTokenInfo('LYRA', AppNetwork.Ethereum)

const StakeFormButton = withSuspense(
  ({ amount, onClose, ...styleProps }: Props) => {
    const lyraBalances = useAccountLyraBalances()
    const account = useWalletAccount()
    const execute = useTransaction(AppNetwork.Ethereum)
    const insufficientBalance = lyraBalances.ethereumLyra.lt(amount)
    const insufficientAllowance = lyraBalances.stakingAllowance.lt(amount)
    const mutateLyraBalances = useMutateAccountLyraBalances()
    const handleClickApprove = useCallback(async () => {
      if (!account) {
        console.warn('Account does not exist')
        return null
      }
      const tokenAddress = LYRA_TOKEN?.address
      if (!tokenAddress) {
        console.warn('Missing token address')
        return null
      }

      const lyra = getERC20Contract(AppNetwork.Ethereum, tokenAddress)
      const lyraStaking = getContract(ContractId.LyraStaking, AppNetwork.Ethereum)

      await execute(
        { contract: lyra, method: 'approve', params: [lyraStaking.address, MAX_BN] },
        TransactionType.StakeLyra,
        {
          onComplete: async () => {
            logEvent(LogEvent.StakeLyraApproveSuccess)
            await mutateLyraBalances()
          },
        }
      )
    }, [account, execute, mutateLyraBalances])

    const handleClickStake = useCallback(async () => {
      if (!account) {
        console.warn('Account or stake does not exist')
        return
      }
      logEvent(LogEvent.StakeLyraSubmit, { stakeAmount: amount })

      const lyraStaking = getContract(ContractId.LyraStaking, AppNetwork.Ethereum)

      await execute({ contract: lyraStaking, method: 'stake', params: [account, amount] }, TransactionType.StakeLyra, {
        onComplete: async () => {
          logEvent(LogEvent.StakeLyraSuccess, { stakeAmount: amount })
          await mutateLyraBalances()
        },
      })

      onClose()
    }, [account, amount, execute, onClose, mutateLyraBalances])

    if (!LYRA_TOKEN) {
      return null
    }

    const stakeButton = (
      <TransactionButton
        transactionType={TransactionType.StakeLyra}
        requireAllowance={
          !insufficientBalance && insufficientAllowance
            ? {
                ...LYRA_TOKEN,
                onClick: handleClickApprove,
              }
            : undefined
        }
        width="100%"
        isDisabled={amount.lte(0) || insufficientBalance}
        network={AppNetwork.Ethereum}
        label={amount.lte(0) ? 'Enter Amount' : insufficientBalance ? 'Insufficient Balance' : 'Stake'}
        onClick={handleClickStake}
      />
    )

    return <Box {...styleProps}>{stakeButton}</Box>
  },
  ({ ...styleProps }) => <ButtonShimmer size="lg" width="100%" {...styleProps} />
)
export default StakeFormButton

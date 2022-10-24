import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { TransactionType } from '@/app/constants/screen'
import useOptimismToken from '@/app/hooks/data/useOptimismToken'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccountWethLyraStaking, {
  useMutateAccountWethLyraStaking,
} from '@/app/hooks/rewards/useAccountWethLyraStaking'
import useClaimableBalances, { useMutateClaimableBalances } from '@/app/hooks/rewards/useClaimableBalance'
import { useCoolMode } from '@/app/hooks/rewards/useCoolMode'
import useTransaction from '@/app/hooks/transaction/useTransaction'
import useWalletAccount from '@/app/hooks/wallet/useWalletAccount'
import filterNulls from '@/app/utils/filterNulls'
import lyra from '@/app/utils/lyra'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  isOpChecked: boolean
  isLyraChecked: boolean
  isStkLyraChecked: boolean
  isWethLyraChecked: boolean
  onClaim?: () => void
}

const ClaimButton = withSuspense(
  ({ isOpChecked, isLyraChecked, isStkLyraChecked, isWethLyraChecked, onClaim }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const owner = useWalletAccount()
    const account = lyra.account(owner ?? '')
    const op = useOptimismToken('op')
    const lyraToken = useOptimismToken('lyra')
    const stkLyra = useOptimismToken('stkLyra')
    const execute = useTransaction()
    const mutateClaimableBalance = useMutateClaimableBalances()
    const claimableBalances = useClaimableBalances()
    const wethLyraAccount = useAccountWethLyraStaking()
    const mutateWethLyraAccount = useMutateAccountWethLyraStaking()
    const ref = useCoolMode([stkLyra?.logoURI ?? '', op?.logoURI ?? ''])
    const isSelectedBalanceZero = ZERO_BN.add(isOpChecked ? claimableBalances.op : ZERO_BN)
      .add(isStkLyraChecked ? claimableBalances.stkLyra : ZERO_BN)
      .add(isLyraChecked ? claimableBalances.lyra : ZERO_BN)
      .add(isWethLyraChecked && wethLyraAccount?.rewards.gt(0) ? wethLyraAccount?.rewards : ZERO_BN)
      .isZero()

    const handleWethLyraClaim = async () => {
      const tx = await account.claimWethLyraRewards()
      setIsLoading(true)
      execute(tx, {
        onComplete: () => {
          mutateWethLyraAccount()
          if (onClaim) {
            onClaim()
          }
          setIsLoading(false)
        },
        onError: () => {
          setIsLoading(false)
        },
      })
    }

    const handleDistributorClaim = async () => {
      const tokens = filterNulls([
        isOpChecked ? op?.address : null,
        isStkLyraChecked ? stkLyra?.address : null,
        isLyraChecked ? lyraToken?.address : null,
      ])
      const tx = await account.claim(tokens)
      setIsLoading(true)
      execute(tx, {
        onComplete: () => {
          mutateClaimableBalance()
          if (onClaim) {
            onClaim()
          }
          setIsLoading(false)
        },
        onError: () => {
          setIsLoading(false)
        },
      })
    }

    return (
      <TransactionButton
        transactionType={TransactionType.ClaimRewards}
        size="lg"
        ref={ref}
        label={!isOpChecked && !isStkLyraChecked && !isLyraChecked && !isWethLyraChecked ? 'Select Rewards' : 'Claim'}
        variant="primary"
        isDisabled={isSelectedBalanceZero}
        isLoading={isLoading}
        onClick={async () => {
          if (isWethLyraChecked) {
            await handleWethLyraClaim()
            return
          }
          await handleDistributorClaim()
        }}
      />
    )
  },
  () => <ButtonShimmer size="lg" />
)

export default ClaimButton

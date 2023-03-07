import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import React from 'react'

import { AppNetwork } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import withSuspense from '@/app/hooks/data/withSuspense'
import { useMutateClaimableStakingRewards } from '@/app/hooks/rewards/useClaimableStakingRewards'
import useClaimableWethLyraRewards from '@/app/hooks/rewards/useClaimableWethLyraRewards'
import { lyraOptimism } from '@/app/utils/lyra'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  onClaim?: () => void
}

const RewardsWethLyraClaimButton = withSuspense(
  ({ onClaim }: Props) => {
    const account = useWalletAccount()
    const execute = useTransaction(AppNetwork.Ethereum)
    const mutateClaimableBalance = useMutateClaimableStakingRewards()
    const claimableBalance = useClaimableWethLyraRewards()

    const handleLyraClaim = async () => {
      if (!account) {
        return
      }
      const tx = await lyraOptimism.claimWethLyraRewards(account)
      await execute(tx, {
        onComplete: () => {
          mutateClaimableBalance()
          if (onClaim) {
            onClaim()
          }
        },
        onError: () => {
          mutateClaimableBalance()
        },
      })
    }

    return (
      <TransactionButton
        transactionType={TransactionType.ClaimWethLyraRewards}
        network={AppNetwork.Ethereum}
        label="Claim"
        isDisabled={claimableBalance.isZero()}
        onClick={async () => await handleLyraClaim()}
      />
    )
  },
  () => <ButtonShimmer width="100%" size="lg" />
)

export default RewardsWethLyraClaimButton

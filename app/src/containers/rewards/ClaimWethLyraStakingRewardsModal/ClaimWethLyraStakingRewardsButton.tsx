import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import React from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import withSuspense from '@/app/hooks/data/withSuspense'
import useClaimableBalancesL1, { useMutateClaimableBalancesL1 } from '@/app/hooks/rewards/useClaimableBalanceL1'
import { lyraOptimism } from '@/app/utils/lyra'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  onClaim?: () => void
}

const ClaimWethLyraStakingRewardsButton = withSuspense(
  ({ onClaim }: Props) => {
    const owner = useWalletAccount()
    const account = lyraOptimism.account(owner ?? '')
    const execute = useTransaction('ethereum')
    const mutateClaimableBalance = useMutateClaimableBalancesL1()
    const claimableBalances = useClaimableBalancesL1()
    const isSelectedBalanceZero = ZERO_BN.add(claimableBalances.lyra).isZero()

    const handleLyraClaim = async () => {
      const tx = await account.claimWethLyraRewards()
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
        network="ethereum"
        label="Claim"
        isDisabled={isSelectedBalanceZero}
        onClick={async () => await handleLyraClaim()}
      />
    )
  },
  () => <ButtonShimmer size="lg" />
)

export default ClaimWethLyraStakingRewardsButton

import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import React from 'react'

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

const ClaimButton = withSuspense(
  ({ onClaim }: Props) => {
    const owner = useWalletAccount()
    const account = lyraOptimism.account(owner ?? '')
    const execute = useTransaction('ethereum')
    const mutateClaimableBalance = useMutateClaimableBalancesL1()
    const claimableBalances = useClaimableBalancesL1()

    const handleStkLyraClaim = async () => {
      const tx = await account.claimStakedLyraRewards()
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
        transactionType={TransactionType.ClaimStakedLyraRewards}
        network="ethereum"
        label="Claim"
        isDisabled={claimableBalances.newStkLyra.isZero()}
        onClick={async () => await handleStkLyraClaim()}
      />
    )
  },
  () => <ButtonShimmer size="lg" />
)

export default ClaimButton

import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import React from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { TransactionType } from '@/app/constants/screen'
import withSuspense from '@/app/hooks/data/withSuspense'
import useClaimableBalancesL1, { useMutateClaimableBalancesL1 } from '@/app/hooks/rewards/useClaimableBalanceL1'
import useTransaction from '@/app/hooks/transaction/useTransaction'
import useWalletAccount from '@/app/hooks/wallet/useWalletAccount'
import { lyraOptimism } from '@/app/utils/lyra'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  isNewStkLyraChecked: boolean
  onClaim?: () => void
}

const ClaimButton = withSuspense(
  ({ isNewStkLyraChecked, onClaim }: Props) => {
    const owner = useWalletAccount()
    const account = lyraOptimism.account(owner ?? '')
    const execute = useTransaction('ethereum')
    const mutateClaimableBalance = useMutateClaimableBalancesL1()
    const claimableBalances = useClaimableBalancesL1()
    const isSelectedBalanceZero = ZERO_BN.add(isNewStkLyraChecked ? claimableBalances.newStkLyra : ZERO_BN).isZero()

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
        label={!isNewStkLyraChecked ? 'Select Rewards' : 'Claim'}
        isDisabled={isSelectedBalanceZero}
        onClick={async () => await handleStkLyraClaim()}
      />
    )
  },
  () => <ButtonShimmer size="lg" />
)

export default ClaimButton

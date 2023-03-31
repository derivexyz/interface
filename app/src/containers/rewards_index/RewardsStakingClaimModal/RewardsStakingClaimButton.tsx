import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import React from 'react'

import { ContractId } from '@/app/constants/contracts'
import { AppNetwork } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import withSuspense from '@/app/hooks/data/withSuspense'
import useClaimableStakingRewards, {
  useMutateClaimableStakingRewards,
} from '@/app/hooks/rewards/useClaimableStakingRewards'
import getContract from '@/app/utils/common/getContract'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  onClaim?: () => void
}

const RewardsStakingClaimButton = withSuspense(
  ({ onClaim }: Props) => {
    const account = useWalletAccount()
    const execute = useTransaction(AppNetwork.Ethereum)
    const mutateClaimableBalance = useMutateClaimableStakingRewards()
    const claimableBalances = useClaimableStakingRewards()

    const handleStkLyraClaim = async () => {
      if (!account) {
        return
      }

      const lyraStaking = getContract(ContractId.LyraStaking, AppNetwork.Ethereum)

      await execute(
        { contract: lyraStaking, method: 'claimRewards', params: [account, claimableBalances] },
        TransactionType.ClaimStakedLyraRewards,
        {
          onComplete: () => {
            mutateClaimableBalance()
            if (onClaim) {
              onClaim()
            }
          },
        }
      )
    }

    return (
      <TransactionButton
        transactionType={TransactionType.ClaimStakedLyraRewards}
        network={AppNetwork.Ethereum}
        label="Claim"
        isDisabled={claimableBalances.isZero()}
        onClick={async () => await handleStkLyraClaim()}
      />
    )
  },
  () => <ButtonShimmer size="lg" />
)

export default RewardsStakingClaimButton

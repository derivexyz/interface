import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import {
  ClaimableBalanceL2,
  Network,
  NEW_STAKED_LYRA_OPTIMISM_ADDRESS,
  OLD_STAKED_LYRA_OPTIMISM_ADDRESS,
  OP_OPTIMISM_MAINNET_ADDRESS,
} from '@lyrafinance/lyra-js'
import React from 'react'
import { useMemo } from 'react'

import { TransactionType } from '@/app/constants/screen'
import useNetwork from '@/app/hooks/account/useNetwork'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import withSuspense from '@/app/hooks/data/withSuspense'
import { useMutateRewardsPageData } from '@/app/hooks/rewards/useRewardsPageData'
import getLyraSDK from '@/app/utils/getLyraSDK'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  claimableOptimismRewards: ClaimableBalanceL2 | null
  onClaim?: () => void
}

const RewardsClaimStkLyraButton = withSuspense(
  ({ claimableOptimismRewards, onClaim }: Props) => {
    const account = useWalletAccount()
    const network = useNetwork()
    const execute = useTransaction(Network.Optimism)
    const mutateRewardsPageData = useMutateRewardsPageData()
    const isClaimableBalanceZero = useMemo(
      () => !claimableOptimismRewards || Object.values(claimableOptimismRewards).every(balance => balance.isZero()),
      [claimableOptimismRewards]
    )

    const handleDistributorClaim = async () => {
      if (!account) {
        return
      }
      // Claim all rewards
      const tx = await getLyraSDK(network).claimRewards(account, [
        OLD_STAKED_LYRA_OPTIMISM_ADDRESS,
        NEW_STAKED_LYRA_OPTIMISM_ADDRESS,
        OP_OPTIMISM_MAINNET_ADDRESS,
      ])
      await execute(tx, TransactionType.ClaimStakedLyraRewards, {
        onComplete: async () => {
          await mutateRewardsPageData()
          if (onClaim) {
            onClaim()
          }
        },
      })
    }

    return (
      <TransactionButton
        network={Network.Optimism}
        transactionType={TransactionType.ClaimRewards}
        width="100%"
        label="Claim"
        isDisabled={isClaimableBalanceZero}
        onClick={async () => {
          await handleDistributorClaim()
        }}
      />
    )
  },
  () => <ButtonShimmer size="lg" />
)

export default RewardsClaimStkLyraButton

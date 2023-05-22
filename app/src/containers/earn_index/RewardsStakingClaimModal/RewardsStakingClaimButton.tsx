import React from 'react'

import { ContractId } from '@/app/constants/contracts'
import { AppNetwork } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { useMutateEarnPageData } from '@/app/hooks/rewards/useEarnPageData'
import getContract from '@/app/utils/common/getContract'
import { LyraStaking } from '@/app/utils/rewards/fetchLyraStaking'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  lyraStaking: LyraStaking
  onClaim?: () => void
}

const RewardsStakingClaimButton = ({ lyraStaking, onClaim }: Props) => {
  const account = useWalletAccount()
  const execute = useTransaction(AppNetwork.Ethereum)
  const mutateRewardsPageData = useMutateEarnPageData()
  const { claimableRewards } = lyraStaking
  const handleStkLyraClaim = async () => {
    if (!account) {
      return
    }

    const lyraStakingContract = getContract(ContractId.LyraStaking, AppNetwork.Ethereum)

    await execute(
      {
        contract: lyraStakingContract,
        method: 'claimRewards',
        params: [account, claimableRewards],
      },
      TransactionType.ClaimStakedLyraRewards,
      {
        onComplete: async () => {
          await mutateRewardsPageData()
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
      isDisabled={claimableRewards.isZero()}
      onClick={async () => await handleStkLyraClaim()}
    />
  )
}

export default RewardsStakingClaimButton

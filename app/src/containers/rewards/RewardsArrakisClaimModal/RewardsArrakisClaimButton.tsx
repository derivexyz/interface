import React from 'react'

import { AppNetwork } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { useMutateArrakisStaking } from '@/app/hooks/rewards/useMutateArrakisStaking'
import { claimArrakisRewards } from '@/app/utils/rewards/claimArrakisRewards'
import { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  arrakisStaking: ArrakisStaking
  onClaim?: () => void
}

const RewardsArrakisClaimButton = ({ arrakisStaking, onClaim }: Props) => {
  const account = useWalletAccount()
  const execute = useTransaction(AppNetwork.Ethereum)
  const mutateArrakisStaking = useMutateArrakisStaking()
  const claimableBalance = arrakisStaking.rewards

  const handleLyraClaim = async () => {
    if (!account) {
      return
    }
    const tx = await claimArrakisRewards(account)
    await execute(tx, TransactionType.ClaimArrakisRewards, {
      onComplete: async () => {
        await mutateArrakisStaking()
        if (onClaim) {
          onClaim()
        }
      },
    })
  }

  return (
    <TransactionButton
      transactionType={TransactionType.ClaimArrakisRewards}
      network={AppNetwork.Ethereum}
      label="Claim"
      isDisabled={claimableBalance.isZero()}
      onClick={async () => await handleLyraClaim()}
    />
  )
}
export default RewardsArrakisClaimButton

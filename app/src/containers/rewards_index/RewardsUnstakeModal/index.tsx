import Modal from '@lyra/ui/components/Modal'
import { AccountLyraBalances, GlobalRewardEpoch, LyraStakingAccount } from '@lyrafinance/lyra-js'
import React from 'react'

import UnstakeModalBody from './RewardsUnstakeModalBody'
import RewardsUnstakeRequestModalBody from './RewardsUnstakeRequestModalBody'

type Props = {
  globalRewardEpoch: GlobalRewardEpoch
  lyraBalances: AccountLyraBalances
  lyraStakingAccount: LyraStakingAccount | null
  isOpen: boolean
  onClose: () => void
}

export default function RewardsUnstakeModal({
  isOpen,
  onClose,
  lyraBalances,
  lyraStakingAccount,
  globalRewardEpoch,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        lyraStakingAccount?.isInUnstakeWindow
          ? 'Complete Unstake'
          : lyraStakingAccount?.isInCooldown
          ? 'Request Sent'
          : 'Request to Unstake'
      }
    >
      {lyraStakingAccount?.isInUnstakeWindow ? (
        <UnstakeModalBody
          onClose={onClose}
          lyraBalances={lyraBalances}
          lyraStakingAccount={lyraStakingAccount}
          globalRewardEpoch={globalRewardEpoch}
        />
      ) : (
        <RewardsUnstakeRequestModalBody lyraBalances={lyraBalances} lyraStakingAccount={lyraStakingAccount} />
      )}
    </Modal>
  )
}

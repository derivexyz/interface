import Modal from '@lyra/ui/components/Modal'
import { GlobalRewardEpoch } from '@lyrafinance/lyra-js'
import React from 'react'

import { LyraBalances } from '@/app/utils/common/fetchLyraBalances'
import { LyraStaking } from '@/app/utils/rewards/fetchLyraStaking'

import UnstakeModalBody from './RewardsUnstakeModalBody'
import RewardsUnstakeRequestModalBody from './RewardsUnstakeRequestModalBody'

type Props = {
  globalRewardEpoch: GlobalRewardEpoch
  lyraBalances: LyraBalances
  lyraStaking: LyraStaking
  isOpen: boolean
  onClose: () => void
}

export default function RewardsUnstakeModal({ isOpen, onClose, lyraBalances, lyraStaking, globalRewardEpoch }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        lyraStaking.isInUnstakeWindow
          ? 'Complete Unstake'
          : lyraStaking.isInCooldown
          ? 'Request Sent'
          : 'Request to Unstake'
      }
    >
      {lyraStaking.isInUnstakeWindow ? (
        <UnstakeModalBody
          onClose={onClose}
          lyraBalances={lyraBalances}
          lyraStaking={lyraStaking}
          globalRewardEpoch={globalRewardEpoch}
        />
      ) : (
        <RewardsUnstakeRequestModalBody lyraBalances={lyraBalances} lyraStaking={lyraStaking} />
      )}
    </Modal>
  )
}

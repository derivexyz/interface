import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import React from 'react'

import RowItem from '@/app/components/common/RowItem'
import TokenAmountText from '@/app/components/common/TokenAmountText'
import TokenAmountTextShimmer from '@/app/components/common/TokenAmountText/TokenAmountTextShimmer'
import withSuspense from '@/app/hooks/data/withSuspense'
import useClaimableWethLyraRewards from '@/app/hooks/rewards/useClaimableWethLyraRewards'

import RewardsWethLyraClaimButton from './RewardsWethLyraClaimButton'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ClaimableBalanceText = withSuspense(
  () => {
    const claimableBalance = useClaimableWethLyraRewards()
    return <TokenAmountText tokenNameOrAddress="lyra" amount={claimableBalance} />
  },
  () => <TokenAmountTextShimmer width={50} />
)

const RewardsWethLyraClaimModal = ({ isOpen, onClose }: Props): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Claim Lyra" centerTitle>
      <ModalBody>
        <RowItem my={8} label="Claimable" value={<ClaimableBalanceText />} />
        <RewardsWethLyraClaimButton onClaim={onClose} />
      </ModalBody>
    </Modal>
  )
}

export default RewardsWethLyraClaimModal

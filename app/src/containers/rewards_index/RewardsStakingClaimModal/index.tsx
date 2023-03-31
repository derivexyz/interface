import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import RowItem from '@/app/components/common/RowItem'
import TokenAmountText from '@/app/components/common/TokenAmountText'
import withSuspense from '@/app/hooks/data/withSuspense'
import useClaimableStakingRewards from '@/app/hooks/rewards/useClaimableStakingRewards'

import RewardsStakingClaimButton from './RewardsStakingClaimButton'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ClaimableBalanceText = withSuspense(
  () => {
    const claimableBalance = useClaimableStakingRewards()
    return <TokenAmountText tokenNameOrAddress="stkLYRA" amount={claimableBalance} />
  },
  () => <TextShimmer />
)

const RewardsStakingClaimModal = withSuspense(({ isOpen, onClose }: Props): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Claim stkLYRA">
      <ModalBody>
        <Text color="secondaryText">
          When you claim stkLYRA, it gets added to your stkLYRA balance. This increases your rewards and contributes to
          your vault boosts and trading rewards. Unstaking LYRA has a 14 day cooldown period.
        </Text>
        <RowItem my={8} label="Claimable" value={<ClaimableBalanceText />} />
        <RewardsStakingClaimButton onClaim={onClose} />
      </ModalBody>
    </Modal>
  )
})

export default RewardsStakingClaimModal

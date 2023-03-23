import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import React from 'react'

import RowItem from '@/app/components/common/RowItem'
import TokenAmountText from '@/app/components/common/TokenAmountText'
import { ZERO_BN } from '@/app/constants/bn'
import { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'

import RewardsArrakisClaimButton from './RewardsArrakisClaimButton'

type Props = {
  isOpen: boolean
  arrakisStaking: ArrakisStaking
  onClose: () => void
}

const RewardsArrakisClaimModal = ({ isOpen, arrakisStaking, onClose }: Props): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Claim Lyra" centerTitle>
      <ModalBody>
        <RowItem
          my={8}
          label="Claimable"
          value={<TokenAmountText tokenNameOrAddress="lyra" amount={arrakisStaking?.rewards ?? ZERO_BN} />}
        />
        <RewardsArrakisClaimButton arrakisStaking={arrakisStaking} onClaim={onClose} />
      </ModalBody>
    </Modal>
  )
}

export default RewardsArrakisClaimModal

import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { DropdownIconButtonElement } from '@lyra/ui/components/Button/DropdownIconButton'
import { MarginProps } from '@lyra/ui/types'
import React, { useCallback, useState } from 'react'

import { AppNetwork } from '@/app/constants/networks'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'

type Props = {
  proposalNetworks: AppNetwork[]
  selectedProposalNetwork: AppNetwork
  onChangeProposalNetwork: (proposalNetwork: AppNetwork) => void
} & MarginProps

const VoteCreateProposalChainDropdown = ({
  proposalNetworks,
  selectedProposalNetwork,
  onChangeProposalNetwork,
  ...styleProps
}: Props): DropdownIconButtonElement => {
  const [isOpen, setIsOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])
  return (
    <DropdownButton
      {...styleProps}
      isOpen={isOpen}
      onClose={onClose}
      onClick={() => setIsOpen(true)}
      textVariant="body"
      label={getNetworkDisplayName(selectedProposalNetwork)}
    >
      {proposalNetworks.map((proposalNetwork, idx) => (
        <DropdownButtonListItem
          onClick={() => {
            onChangeProposalNetwork(proposalNetwork)
            onClose()
          }}
          key={idx}
          isSelected={proposalNetwork === selectedProposalNetwork}
          label={getNetworkDisplayName(proposalNetwork)}
        />
      ))}
    </DropdownButton>
  )
}

export default VoteCreateProposalChainDropdown

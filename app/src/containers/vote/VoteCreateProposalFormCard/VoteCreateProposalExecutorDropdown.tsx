import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { DropdownIconButtonElement } from '@lyra/ui/components/Button/DropdownIconButton'
import { MarginProps } from '@lyra/ui/types'
import React, { useCallback, useState } from 'react'

import { Executor } from '@/app/constants/governance'

type Props = {
  executors: Executor[]
  selectedExecutor: Executor
  onChangeExecutor: (executor: Executor) => void
} & MarginProps

const VoteCreateProposalExecutorDropdown = ({
  executors,
  selectedExecutor,
  onChangeExecutor,
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
      label={selectedExecutor.label}
    >
      {executors.map((executor, idx) => (
        <DropdownButtonListItem
          onClick={() => {
            onChangeExecutor(executor)
            onClose()
          }}
          key={idx}
          isSelected={executor.label === selectedExecutor.label}
          label={executor.label}
        />
      ))}
    </DropdownButton>
  )
}

export default VoteCreateProposalExecutorDropdown

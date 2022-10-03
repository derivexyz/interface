import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { Placement } from '@popperjs/core'
import React, { useState } from 'react'

import Card from '../Card'
import CardBody from '../Card/CardBody'
import List from '../List'
import Modal from '../Modal'
import Popover from '../Popover'
import { DropdownButtonListItemElement } from './DropdownButtonListItem'
import IconButton, { IconButtonProps } from './IconButton'

export type DropdownIconButtonProps = {
  isOpen: boolean
  onClose: () => void
  children?: DropdownButtonListItemElement | (DropdownButtonListItemElement | null)[] | null
  placement?: Placement
} & Omit<IconButtonProps, 'children'>

export type DropdownIconButtonElement = React.ReactElement<DropdownIconButtonProps>

export default function DropdownIconButton({
  isOpen,
  onClose,
  children,
  placement,
  ...buttonProps
}: DropdownIconButtonProps): DropdownIconButtonElement {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const isMobile = useIsMobile()
  return (
    <>
      <IconButton ref={setRef} {...buttonProps} />
      {!isMobile ? (
        <Popover
          placement={placement}
          innerRef={ref}
          isOpen={isOpen}
          onChange={isOpen => {
            if (!isOpen) {
              onClose()
            }
          }}
        >
          <Card variant="elevated" overflow="hidden" sx={{ borderRadius: 'list' }}>
            <CardBody noPadding>
              <List>{children}</List>
            </CardBody>
          </Card>
        </Popover>
      ) : (
        <Modal isOpen={isOpen} onClose={onClose}>
          <List>{children}</List>
        </Modal>
      )}
    </>
  )
}

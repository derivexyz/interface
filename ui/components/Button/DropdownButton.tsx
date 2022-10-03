import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { Placement } from '@popperjs/core'
import React, { useState } from 'react'

import Button, { ButtonProps } from '../Button'
import Card from '../Card'
import CardBody from '../Card/CardBody'
import { IconType } from '../Icon'
import List from '../List'
import Modal from '../Modal'
import Popover from '../Popover'
import { DropdownButtonListItemElement } from './DropdownButtonListItem'

export type DropdownButtonProps = {
  isOpen: boolean
  onClose: () => void
  children?: DropdownButtonListItemElement | (DropdownButtonListItemElement | null)[] | null
  placement?: Placement
  hideRightIcon?: boolean
} & Omit<ButtonProps, 'rightIcon' | 'children'>

export type DropdownButtonElement = React.ReactElement<DropdownButtonProps>

export default function DropdownButton({
  children,
  placement,
  isOpen,
  onClose,
  hideRightIcon,
  ...buttonProps
}: DropdownButtonProps): DropdownButtonElement {
  const [ref, setRef] = useState<HTMLElement | null>(null)
  const isMobile = useIsMobile()
  return (
    <>
      <Button
        ref={setRef}
        rightIcon={!hideRightIcon ? (!isOpen ? IconType.ChevronDown : IconType.ChevronUp) : null}
        rightIconSpacing={1}
        {...buttonProps}
      />
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
          <Card variant="elevated" sx={{ borderRadius: 'list' }}>
            <CardBody variant="elevated" noPadding>
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

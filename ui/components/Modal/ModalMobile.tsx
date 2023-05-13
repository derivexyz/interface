import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import emptyFunction from '@lyra/ui/utils/emptyFunction'
import React from 'react'
import Sheet from 'react-modal-sheet'

import IconButton from '../Button/IconButton'
import Flex from '../Flex'
import Icon, { IconType } from '../Icon'
import Text from '../Text'

export type Props = {
  isOpen: boolean
  onClose?: () => void
  title?: string | Exclude<React.ReactNode, string> | null
  isFullscreen?: boolean
  children?: React.ReactNode
}

export default function ModalMobile({ children, isFullscreen, isOpen, onClose = emptyFunction, title }: Props) {
  const modalBg = useThemeColor('modalBg')
  const modalOverlayBg = useThemeColor('modalOverlayBg')
  return (
    <Sheet
      detent={isFullscreen ? 'full-height' : 'content-height'}
      disableDrag={isFullscreen}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Sheet.Container
        style={{
          backgroundColor: modalBg,
          borderTopRightRadius: '21px',
          borderTopLeftRadius: '21px',
          overflow: 'hidden',
        }}
      >
        <Sheet.Header>
          <Flex bg="modalBg" alignItems="center" p={3}>
            {typeof title === 'string' ? <Text variant="cardHeading">{title}</Text> : title}
            <IconButton ml="auto" icon={<Icon icon={IconType.X} size={24} />} isTransparent onClick={onClose} />
          </Flex>
        </Sheet.Header>
        <Sheet.Content>
          <Flex flexDirection="column" bg="modalBg">
            {children}
          </Flex>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop style={{ backgroundColor: modalOverlayBg }} onTap={onClose} />
    </Sheet>
  )
}

import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import useThemeValue from '@lyra/ui/hooks/useThemeValue'
import { ResponsiveValue } from '@lyra/ui/types'
import React from 'react'
import Modal from 'react-modal'

import IconButton from '../Button/IconButton'
import Flex from '../Flex'
import { IconType } from '../Icon'
import Text from '../Text'

const DESKTOP_MODAL_WIDTH = 420

export type Props = {
  isOpen: boolean
  onClose?: () => void
  title?: string | Exclude<React.ReactNode, string> | null
  children?: React.ReactNode
  noPadding?: boolean
  width?: ResponsiveValue
}

export default function ModalDesktop({ isOpen, onClose, title, children, width = DESKTOP_MODAL_WIDTH }: Props) {
  const modalBg = useThemeColor('modalBg')
  const modalOverlayBg = useThemeColor('modalOverlayBg')
  const widthVal = parseInt(useThemeValue(width)?.toString(), 10)
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          overflow: 'auto',
          background: modalBg,
          width: widthVal,
          border: '0px solid',
          padding: 0,
          borderRadius: 21,
          zIndex: 101,
        },
        overlay: {
          background: modalOverlayBg,
          overflow: 'auto',
          paddingTop: '120px',
          paddingBottom: '120px',
          zIndex: 100,
        },
      }}
    >
      <Flex px={6} pt={4} width="100%" bg="modalBg" alignItems="center">
        {typeof title === 'string' ? <Text variant="cardHeading">{title}</Text> : title}
        {onClose ? (
          <IconButton
            ml="auto"
            variant="light"
            icon={IconType.X}
            onClick={e => {
              onClose()
              e.stopPropagation()
            }}
          />
        ) : null}
      </Flex>
      {children}
    </Modal>
  )
}

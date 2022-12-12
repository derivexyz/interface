import { ModalContext } from '@lyra/ui/theme/ModalProvider'
import React, { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import Box from '../Box'
import Center from '../Center'
import Flex from '../Flex'
import Text from '../Text'

export type Props = {
  isOpen: boolean
  onClose?: () => void
  title?: string | Exclude<React.ReactNode, string> | null
  isFullscreen?: boolean
  children?: React.ReactNode
}

// TODO: @dappbeast Make these constants parameters
const MOBILE_FOOTER_HEIGHT = 72

export default function ModalMobile({ children, isFullscreen, isOpen, onClose, title }: Props) {
  const { openModalId, setOpenModalId } = useContext(ModalContext)
  const [_id, setId] = useState<number | null>(null)

  useEffect(() => {
    if (isOpen && !_id) {
      // Assign ID on open
      const id = openModalId + 1
      setId(id)
      // Increment open modals
      setOpenModalId(id)
    } else if (!isOpen && _id) {
      // Decrement open modals
      setOpenModalId(openModalId - 1)
      // Remove ID on close
      setId(null)
    }
    // Set modal to local state
  }, [isOpen, setOpenModalId, openModalId, _id])

  useEffect(() => {
    if (_id && _id > openModalId) {
      // Sync local state to modal (e.g. on modal close)
      if (onClose) {
        onClose()
      }
      setId(null)
    }
    // Causes infinite loop if onClose is not memoized
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openModalId])

  return createPortal(
    isOpen ? (
      <Flex
        width="100%"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: MOBILE_FOOTER_HEIGHT,
          maxHeight: '100vh',
          zIndex: 'modal',
        }}
        bg="modalOverlayBg"
        flexDirection="column"
        justifyContent="flex-end"
        onClick={onClose}
      >
        {/* TODO: @michaelxuwu Animate modal appearance (using react-spring?) */}
        <Box
          mt="auto"
          width="100%"
          height={isFullscreen ? '100%' : null}
          sx={{ borderTopRightRadius: isFullscreen ? 0 : 'card', borderTopLeftRadius: isFullscreen ? 0 : 'card' }}
          bg="modalBg"
          overflow="auto"
          // Block parent onClose trigger
          onClick={e => e.stopPropagation()}
        >
          {typeof title === 'string' ? (
            <Center p={4}>
              <Text variant="heading">{title}</Text>
            </Center>
          ) : (
            title
          )}
          {children}
        </Box>
      </Flex>
    ) : null,
    document.body
  )
}

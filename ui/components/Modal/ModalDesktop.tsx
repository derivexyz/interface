import { ResponsiveValue } from '@lyra/ui/types'
import isServer from '@lyra/ui/utils/isServer'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

import Box from '../Box'
import IconButton from '../Button/IconButton'
import Card from '../Card'
import Flex from '../Flex'
import { IconType } from '../Icon/IconSVG'
import Text from '../Text'
import ModalSection from './ModalSection'

const DESKTOP_MODAL_WIDTH = 360

export type Props = {
  isOpen: boolean
  onClose?: () => void
  title?: string | Exclude<React.ReactNode, string> | null
  children?: React.ReactNode
  noPadding?: boolean
  width?: ResponsiveValue
}

export default function ModalDesktop({ isOpen, onClose, title, children, width = DESKTOP_MODAL_WIDTH }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (isServer()) {
    return null
  }
  return isOpen
    ? ReactDOM.createPortal(
        <Flex
          justifyContent="center"
          sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bg: 'modalOverlayBg', zIndex: 'modal' }}
          onClick={onClose}
        >
          <Box pt={100} pb={8} overflow="auto">
            <Card
              flexDirection="column"
              width={width}
              variant="modal"
              onClick={e => {
                e.stopPropagation()
              }}
            >
              <ModalSection noPadding variant="elevated" noSpacing>
                <Flex px={6} pt={4} width="100%" bg="modalBg" alignItems="center">
                  {typeof title === 'string' ? <Text variant="heading">{title}</Text> : title}
                  {onClose ? <IconButton ml="auto" variant="light" icon={IconType.X} onClick={onClose} /> : null}
                </Flex>
              </ModalSection>
              {children}
            </Card>
          </Box>
        </Flex>,
        document.body
      )
    : null
}

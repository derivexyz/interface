import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { ResponsiveValue } from '@lyra/ui/types'
import React from 'react'

import ModalDesktop from './ModalDesktop'
import ModalMobile from './ModalMobile'

export type Props = {
  isOpen: boolean
  onClose?: () => void
  title?: string | Exclude<React.ReactNode, string> | null
  children?: React.ReactNode
  desktopWidth?: ResponsiveValue
  isMobileFullscreen?: boolean
}

export default function Modal({ isOpen, onClose, title, children, isMobileFullscreen, desktopWidth }: Props) {
  const isMobile = useIsMobile()
  if (isMobile) {
    return (
      <ModalMobile isOpen={isOpen} onClose={onClose} title={title} isFullscreen={isMobileFullscreen}>
        {children}
      </ModalMobile>
    )
  } else {
    return (
      <ModalDesktop isOpen={isOpen} onClose={onClose} title={title} width={desktopWidth}>
        {children}
      </ModalDesktop>
    )
  }
}

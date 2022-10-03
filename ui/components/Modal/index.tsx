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
  isMobileFullscreen?: boolean
  noPadding?: boolean
  width?: ResponsiveValue
}

export default function Modal({ isOpen, isMobileFullscreen, onClose, title, children, width }: Props) {
  const isMobile = useIsMobile()
  if (isMobile) {
    return (
      <ModalMobile isFullscreen={isMobileFullscreen} isOpen={isOpen} onClose={onClose} title={title}>
        {children}
      </ModalMobile>
    )
  } else {
    return (
      <ModalDesktop isOpen={isOpen} onClose={onClose} title={title} width={width}>
        {children}
      </ModalDesktop>
    )
  }
}

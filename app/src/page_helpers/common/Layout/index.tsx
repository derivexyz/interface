import { TextElement } from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React from 'react'
import { useLocation } from 'react-router-dom'

import LayoutDesktop from './LayoutDesktop'
import LayoutMobile from './LayoutMobile'

type Props = {
  children?: React.ReactNode
  showBackButton?: boolean
  backHref?: string
  isLoading?: boolean
  desktopRightColumn?: React.ReactNode
  desktopFooter?: React.ReactNode
  header?: React.ReactNode
  desktopHeader?: React.ReactNode
  mobileHeader?: React.ReactNode
  mobileCollapsedHeader?: string | TextElement | (TextElement | null)[] | null
}

export default function Layout({
  children,
  showBackButton,
  backHref,
  isLoading,
  header,
  desktopRightColumn,
  desktopFooter,
  desktopHeader,
  mobileHeader,
  mobileCollapsedHeader,
}: Props): JSX.Element {
  const isMobile = useIsMobile()
  const location = useLocation()
  const currentPath = location.pathname

  return isMobile ? (
    <LayoutMobile
      backHref={backHref}
      showBackButton={showBackButton}
      header={mobileHeader ?? header}
      collapsedHeader={mobileCollapsedHeader}
      isLoading={isLoading}
    >
      {children}
    </LayoutMobile>
  ) : (
    <LayoutDesktop
      backHref={backHref}
      showBackButton={showBackButton}
      header={desktopHeader ?? header}
      footer={desktopFooter}
      rightColumn={desktopRightColumn}
      currentPath={currentPath}
      isLoading={isLoading}
    >
      {children}
    </LayoutDesktop>
  )
}

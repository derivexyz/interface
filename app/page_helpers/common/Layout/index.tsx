import { TextElement } from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

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
  const router = useRouter()

  const [isRouteChanging, setIsRouteChanging] = useState(false)
  const [currentPath, setCurrentPath] = useState(router.asPath)

  useEffect(() => {
    const handleStart = (url: string, { shallow }: { shallow: boolean }) => {
      if (url !== router.asPath && !shallow) {
        setCurrentPath(url)
        setIsRouteChanging(true)
      }
    }
    const handleComplete = () => setIsRouteChanging(false)
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  })

  const isLoadingOrRouteChanging = isLoading || isRouteChanging

  return isMobile ? (
    <LayoutMobile
      backHref={backHref}
      showBackButton={showBackButton}
      header={mobileHeader ?? header}
      collapsedHeader={mobileCollapsedHeader}
      isLoading={isLoadingOrRouteChanging}
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
      isLoading={isLoadingOrRouteChanging}
    >
      {children}
    </LayoutDesktop>
  )
}

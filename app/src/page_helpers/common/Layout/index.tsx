import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import ThemeGlobalStyle from '@lyra/ui/theme/ThemeGlobalStyle'
import React from 'react'

import LayoutDesktop from './LayoutDesktop'
import LayoutMobile from './LayoutMobile'

type Props = {
  children?: React.ReactNode
}

export default function Layout({ children }: Props): JSX.Element {
  const isMobile = useIsMobile()
  return (
    <>
      <ThemeGlobalStyle />
      {isMobile ? <LayoutMobile>{children}</LayoutMobile> : <LayoutDesktop>{children}</LayoutDesktop>}
    </>
  )
}

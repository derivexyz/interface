import { CardElement } from '@lyra/ui/components/Card'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React from 'react'

import PageDesktop from './PageDesktop'
import PageMobile from './PageMobile'

export type PageProps = {
  title?: string
  subtitle?: string
  isFullWidth?: boolean
  headerCard?: CardElement
  showBackButton?: boolean
  backHref?: string
  children?: React.ReactNode
}

export default function Page({ children, ...props }: PageProps): JSX.Element {
  const isMobile = useIsMobile()
  return isMobile ? <PageMobile {...props}>{children}</PageMobile> : <PageDesktop {...props}>{children}</PageDesktop>
}

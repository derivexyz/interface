import ThemeGlobalStyle from '@lyra/ui/theme/ThemeGlobalStyle'
import React from 'react'

type Props = {
  children?: React.ReactNode
}

// Shared between all pages
// TODO: @dappbeast Move Layout skeleton into shared AppLayout
export default function AppLayout({ children }: Props): JSX.Element {
  return (
    <>
      <ThemeGlobalStyle />
      {children}
    </>
  )
}

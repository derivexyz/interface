import React from 'react'

import LayoutMobileBottomNav from './LayoutMobileBottomNav'

type Props = {
  children?: React.ReactNode
}

export default function LayoutMobile({ children }: Props): JSX.Element {
  return (
    <>
      {children}
      <LayoutMobileBottomNav />
    </>
  )
}

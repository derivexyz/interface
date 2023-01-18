import Background from '@lyra/ui/components/Background'
import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import React from 'react'

import LayoutDesktopNav from './LayoutDesktopNav'

type Props = {
  children?: React.ReactNode
}

export default function LayoutDesktop({ children }: Props): JSX.Element {
  const [isDarkMode] = useIsDarkMode()

  return (
    <>
      <LayoutDesktopNav />
      <Background
        bg={isDarkMode ? 'background' : 'bgGradient'}
        mx="auto"
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          pointerEvents: 'none',
          zIndex: -1,
          transform: 'translate(-50%, -50%)',
        }}
      />
      {children}
    </>
  )
}

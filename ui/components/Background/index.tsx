import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import useThemeColor from '@lyra/ui/hooks/useThemeColor'
import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import Box from '../Box'
import { FlexProps } from '../Flex'

type Props = { backgroundColor?: string; bloomTop?: string; bloomLeft?: string } & MarginProps & LayoutProps & FlexProps

export default function Background({
  backgroundColor = 'background',
  bloomTop: top = '-40%',
  bloomLeft: left = '-33%',
  ...styleProps
}: Props): JSX.Element {
  const [isDarkMode] = useIsDarkMode()
  const backgroundColorVal = useThemeColor(backgroundColor)
  return (
    <Box {...styleProps} width="100%" height="100%" sx={{ background: backgroundColorVal, ...styleProps.sx }}>
      <Box
        maxWidth="1420px"
        width="100%"
        height="100%"
        overflow="visible"
        sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
      >
        <Box
          width="1300px"
          height="1500px"
          sx={{
            position: 'absolute',
            // top,
            // left,
            background: isDarkMode
              ? `
          radial-gradient(ellipse, #3DFFFF08 0%, 
            #3DFFFF08 20%, 
            #3DFFFF05 40%, 
            #3DFFFF01 60%,
            #00000000 80%, 
            #00000000 100%)
          `
              : `
            radial-gradient(ellipse, #3DFFFF1A 0%, 
              #3DFFFF14 20%, 
              #3DFFFF14 40%, 
              #3DFFFF0A 60%, 
              #3DFFFF00 80%, 
              #00000000 100%)
          `,
            transform: `translate(${top}, ${left})`,
          }}
        />
        <Box
          width="1500px"
          height="1000px"
          sx={{
            position: 'absolute',
            background: isDarkMode
              ? `
          radial-gradient(ellipse, #3DFFFF08 0%, 
            #3DFFFF08 15%, 
            #3DFFFF05 31%, 
            #00000000 50%, 
            #00000000 100%)
          `
              : `
            radial-gradient(ellipse, #3DFFFF05 0%, 
              #3DFFFF05 15%, 
              #3DFFFF03 65%, 
              #00000000 75%, 
              #00000000 100%)
            `,
            transform: 'rotate(-45deg) translate(10%, 40%)',
          }}
        />
      </Box>
    </Box>
  )
}

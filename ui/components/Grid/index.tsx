import React from 'react'
import { Box, BoxProps } from 'rebass'

/* eslint-disable react/prop-types */
const Grid = React.forwardRef<HTMLDivElement, BoxProps>(({ children, ...props }, ref) => {
  return (
    <Box {...(props as any)} ref={ref} display="grid">
      {children}
    </Box>
  )
})

export default Grid

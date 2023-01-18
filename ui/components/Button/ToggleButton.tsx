import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import Grid from '../Grid'
import { ToggleButtonItemElement } from './ToggleButtonItem'

export type ToggleButtonProps = {
  children: ToggleButtonItemElement[]
} & MarginProps &
  LayoutProps

export type ToggleButtonElement = React.ReactElement<ToggleButtonProps>

export default function ToggleButton({ children, ...styleProps }: ToggleButtonProps): ToggleButtonElement {
  return (
    <Grid
      sx={{ borderRadius: 'circle', gridTemplateColumns: `repeat(${children.length}, 1fr)`, columnGap: 1 }}
      height={36}
      {...styleProps}
    >
      {children}
    </Grid>
  )
}

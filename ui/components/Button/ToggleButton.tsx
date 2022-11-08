import Flex from '@lyra/ui/components/Flex'
import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import { ToggleButtonItemElement } from './ToggleButtonItem'

export type ToggleButtonProps = {
  children: ToggleButtonItemElement[]
} & MarginProps &
  LayoutProps

export type ToggleButtonElement = React.ReactElement<ToggleButtonProps>

export default function ToggleButton({ children, ...styleProps }: ToggleButtonProps): ToggleButtonElement {
  return (
    <Flex alignSelf="baseline" alignItems="center" sx={{ borderRadius: 'circle' }} height={36} {...styleProps}>
      {children}
    </Flex>
  )
}

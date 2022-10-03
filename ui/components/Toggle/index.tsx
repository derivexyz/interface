import React from 'react'
import ReactToggle from 'react-toggle'

import { MarginProps } from '../../types'
import Box from '../Box'

export type ToggleProps = {
  isChecked?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
} & MarginProps

export default function Toggle({ isChecked, onChange, ...marginProps }: ToggleProps) {
  return (
    <Box {...marginProps} height={18} bg="transparent">
      <ReactToggle
        defaultChecked={isChecked}
        onChange={onChange}
        icons={{
          checked: null,
          unchecked: null,
        }}
      />
    </Box>
  )
}

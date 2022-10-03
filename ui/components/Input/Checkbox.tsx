import { Checkbox as RebassCheckbox } from '@rebass/forms'
import React from 'react'
import { MarginProps, PaddingProps } from 'styled-system'

type Props = {
  checked: boolean
  onToggle: (checked: boolean) => void
  isDisabled?: boolean
} & PaddingProps &
  MarginProps

export default function Checkbox({ checked, onToggle, isDisabled, ...styleProps }: Props) {
  return (
    <RebassCheckbox
      sx={{
        cursor: 'pointer',
        color: isDisabled ? 'buttonDisabled' : checked ? 'primaryText' : 'secondaryText',
      }}
      onChange={e => onToggle(e.currentTarget.checked)}
      checked={checked}
      disabled={isDisabled}
      {...styleProps}
    />
  )
}

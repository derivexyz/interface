import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

import { TextVariant } from '../Text'
import Button, { ButtonSize } from '.'

export type ToggleButtonItemProps<ToggleButtonItemID extends string | number = string | number> = {
  id: ToggleButtonItemID
  label: string
  isSelected: boolean
  size?: ButtonSize
  textVariant?: TextVariant
  onSelect: (id: ToggleButtonItemID) => void
} & LayoutProps &
  MarginProps

export type ToggleButtonItemElement = React.ReactElement<ToggleButtonItemProps>

export default function ToggleButtonItem<ToggleButtonItemID extends string | number = string | number>({
  id,
  label,
  isSelected,
  onSelect,
  size = 'medium',
  textVariant = 'secondaryMedium',
  ...styleProps
}: ToggleButtonItemProps<ToggleButtonItemID>) {
  function handleOnChange(id: ToggleButtonItemID) {
    onSelect(id)
  }
  return (
    <Button
      {...styleProps}
      isTransparent={!isSelected}
      variant={isSelected ? 'default' : 'light'}
      size={size}
      onClick={() => handleOnChange(id)}
      label={label}
      textVariant={textVariant}
    />
  )
}

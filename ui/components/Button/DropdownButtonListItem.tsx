import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import coerce from '@lyra/ui/utils/coerce'
import React from 'react'

import Icon, { IconType } from '../Icon'
import ListItem, { ListItemProps } from '../List/ListItem'
import Text from '../Text'

export type DropdownButtonListItemProps = Omit<ListItemProps & { isSelected?: boolean }, 'variant'>

export type DropdownButtonListItemElement = React.ReactElement<DropdownButtonListItemProps>

export default function DropdownButtonListItem({
  label,
  isDisabled,
  rightContent: _rightContent,
  icon: _icon,
  isSelected,
  ...props
}: DropdownButtonListItemProps): DropdownButtonListItemElement {
  const isMobile = useIsMobile()
  let dropdownLabel = label
  let icon = _icon
  if (isMobile) {
    // TODO: @dappbeast Remove hacks
    if (typeof label === 'string') {
      dropdownLabel = (
        <Text variant="heading" color={isDisabled ? 'disabledText' : 'secondaryText'} my={2}>
          {label}
        </Text>
      )
    }
    const iconType = coerce(IconType, icon)
    if (iconType) {
      icon = null
    }
  }
  return (
    <ListItem
      label={dropdownLabel}
      rightContent={
        _rightContent ? _rightContent : isSelected ? <Icon icon={IconType.Check} color="text" size={16} /> : null
      }
      icon={icon}
      isDisabled={isDisabled}
      sx={{
        color: isSelected ? 'text' : 'secondaryText',
        bg: isSelected ? 'hover' : undefined,
      }}
      {...props}
    />
  )
}

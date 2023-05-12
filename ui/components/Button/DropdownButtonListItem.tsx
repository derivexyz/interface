import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React from 'react'

import ListItem, { ListItemProps } from '../List/ListItem'
import Text from '../Text'

export type DropdownButtonListItemProps = Omit<ListItemProps & { isSelected?: boolean }, 'variant'>

export type DropdownButtonListItemElement = React.ReactElement<DropdownButtonListItemProps>

export default function DropdownButtonListItem({
  label,
  isDisabled,
  isSelected,
  ...props
}: DropdownButtonListItemProps): DropdownButtonListItemElement {
  const isMobile = useIsMobile()
  let dropdownLabel = label
  if (typeof label === 'string') {
    dropdownLabel = (
      <Text variant={!isMobile ? 'small' : 'cardHeading'} my={!isMobile ? 0 : 1}>
        {label}
      </Text>
    )
  }
  return <ListItem label={dropdownLabel} isDisabled={isDisabled} isSelected={isSelected} {...props} />
}

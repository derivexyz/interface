import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import useHover from '@lyra/ui/hooks/useHover'
import React from 'react'
import { LayoutProps, MarginProps } from 'styled-system'

export type ToggleButtonItemProps<ToggleButtonItemID extends string | number = string | number> = {
  id: ToggleButtonItemID
  label: string
}

export type ToggleButtonProps<ToggleButtonItemID extends string | number = string | number> = {
  items: ToggleButtonItemProps<ToggleButtonItemID>[]
  selectedItemId: ToggleButtonItemID
  onChange?: (itemId: ToggleButtonItemID) => void
} & MarginProps &
  LayoutProps

export type ToggleButtonElement = React.ReactElement<ToggleButtonProps>

function ToggleButtonItem({
  item,
  isSelected,
  onChange,
  ...styleProps
}: {
  item: ToggleButtonItemProps
  isSelected: boolean
  onChange: () => void
} & LayoutProps &
  MarginProps) {
  const [hoverRef, isHover] = useHover<HTMLDivElement>()
  return (
    <Flex
      ref={hoverRef}
      key={item.id}
      onClick={onChange}
      bg={isSelected ? 'toggleButtonActive' : 'transparent'}
      alignItems="center"
      justifyContent="center"
      height="100%"
      px={4}
      sx={{
        borderRadius: 'circle',
        cursor: 'pointer',
      }}
      {...styleProps}
    >
      <Text variant="secondaryMedium" color={isSelected || isHover ? 'text' : 'secondaryText'}>
        {item.label}
      </Text>
    </Flex>
  )
}

export default function ToggleButton<ToggleButtonItemID extends string | number = string | number>({
  items,
  selectedItemId,
  onChange,
  ...styleProps
}: ToggleButtonProps<ToggleButtonItemID>): ToggleButtonElement {
  return (
    <Flex
      alignSelf="baseline"
      alignItems="center"
      p="6px"
      bg="toggleButtonBg"
      sx={{ borderRadius: 'circle' }}
      height={36}
      {...styleProps}
    >
      {items.map((item, idx) => {
        const isSelected = item.id === selectedItemId
        return (
          <ToggleButtonItem
            key={item.id}
            mr={idx < items.length - 1 ? '6px' : 0}
            item={item}
            isSelected={isSelected}
            onChange={() => (onChange ? onChange(item.id) : null)}
          />
        )
      })}
    </Flex>
  )
}

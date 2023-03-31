import Flex from '@lyra/ui/components/Flex'
import Text, { TextColor, TextVariant } from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React from 'react'

type Props = {
  label: string | React.ReactNode
  value: string | React.ReactNode
  textVariant?: TextVariant
  valueColor?: TextColor
} & MarginProps &
  LayoutProps

export default function RowItem({
  label,
  value,
  textVariant = 'secondary',
  valueColor = 'text',
  ...styleProps
}: Props) {
  return (
    <Flex justifyContent="space-between" alignItems="center" {...styleProps}>
      {typeof label === 'string' ? (
        <Text variant={textVariant} color="secondaryText">
          {label}
        </Text>
      ) : (
        label
      )}
      {typeof value === 'string' ? (
        <Text textAlign="right" variant={textVariant} color={valueColor}>
          {value}
        </Text>
      ) : (
        value
      )}
    </Flex>
  )
}

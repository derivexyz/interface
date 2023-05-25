import Flex from '@lyra/ui/components/Flex'
import Text, { TextColor } from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React from 'react'

type Props = {
  label: string | React.ReactNode
  value: string | React.ReactNode
  valueColor?: TextColor
  variant?: 'small' | 'body'
} & MarginProps &
  LayoutProps

export default function RowItem({ label, value, variant, valueColor = 'text', ...styleProps }: Props) {
  return (
    <Flex justifyContent="space-between" alignItems="center" {...styleProps}>
      {typeof label === 'string' ? (
        <Text variant={variant} color="secondaryText">
          {label}
        </Text>
      ) : (
        label
      )}
      {typeof value === 'string' ? (
        <Text variant={variant} textAlign="right" color={valueColor}>
          {value}
        </Text>
      ) : (
        value
      )}
    </Flex>
  )
}

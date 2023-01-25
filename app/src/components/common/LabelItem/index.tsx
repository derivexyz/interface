import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Text, { TextColor, TextVariant } from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React from 'react'

type Props = {
  label: string | React.ReactNode
  value: string | React.ReactNode
  valueColor?: TextColor
  valueTextVariant?: TextVariant
  noPadding?: boolean
} & MarginProps &
  LayoutProps

export default function LabelItem({
  label,
  value,
  valueColor,
  noPadding,
  valueTextVariant = 'secondary',
  ...styleProps
}: Props) {
  return (
    <Flex flexDirection="column" {...styleProps}>
      {typeof label === 'string' ? (
        <Text variant="secondary" color="secondaryText" mb={!noPadding ? 2 : 0}>
          {label}
        </Text>
      ) : (
        <Box mb={!noPadding ? 2 : 0}>{label}</Box>
      )}
      <Flex flexGrow={1} flexDirection="column" justifyContent="center" alignItems="baseline">
        {typeof value === 'string' ? (
          <Text variant={valueTextVariant} color={valueColor}>
            {value}
          </Text>
        ) : (
          value
        )}
      </Flex>
    </Flex>
  )
}

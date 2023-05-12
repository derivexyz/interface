import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Text, { TextColor } from '@lyra/ui/components/Text'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React from 'react'

type Props = {
  label: string | React.ReactNode
  value: string | React.ReactNode
  valueColor?: TextColor
  noPadding?: boolean
} & MarginProps &
  LayoutProps

export default function LabelItem({ label, value, valueColor, noPadding, ...styleProps }: Props) {
  return (
    <Flex flexDirection="column" {...styleProps}>
      {typeof label === 'string' ? (
        <Text variant="small" color="secondaryText" mb={!noPadding ? 2 : 0}>
          {label}
        </Text>
      ) : (
        <Box mb={!noPadding ? 2 : 0}>{label}</Box>
      )}
      <Flex flexGrow={1} flexDirection="column" justifyContent="center" alignItems="baseline">
        {typeof value === 'string' ? <Text color={valueColor}>{value}</Text> : value}
      </Flex>
    </Flex>
  )
}

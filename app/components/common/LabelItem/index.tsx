import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Text, { TextColor, TextVariant } from '@lyra/ui/components/Text'
import React from 'react'

type Props = {
  label: string | React.ReactNode
  value: string | React.ReactNode
  valueColor?: TextColor
  valueTextVariant?: TextVariant
}

export default function LabelItem({ label, value, valueColor, valueTextVariant = 'secondary', ...styleProps }: Props) {
  return (
    <Flex flexDirection="column" {...styleProps}>
      {typeof label === 'string' ? (
        <Text variant="secondary" color="secondaryText" mb={2}>
          {label}
        </Text>
      ) : (
        <Box mb={2}>{label}</Box>
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

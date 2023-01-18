import React from 'react'
import { MarginProps } from 'styled-system'

import Flex from '../Flex'
import Text from '../Text'

export type TableRowMarkerProps = {
  content: string | React.ReactNode
} & MarginProps

export default function TableRowMarker({ content, ...styleProps }: TableRowMarkerProps) {
  return (
    <Flex alignItems="center" justifyContent="center" height={1} as="tr" bg="primaryText" {...styleProps}>
      <Flex
        as="td"
        alignItems="center"
        justifyContent="center"
        px={3}
        py={1}
        bg="primaryButtonBg"
        sx={{
          borderRadius: 'card',
          boxShadow: '10px 10px 10px elevatedShadowBg',
        }}
      >
        {React.isValidElement(content) ? content : <Text variant="secondaryMedium">{content}</Text>}
      </Flex>
    </Flex>
  )
}

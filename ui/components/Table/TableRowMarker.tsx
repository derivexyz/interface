import React from 'react'
import { MarginProps } from 'styled-system'

import Flex from '../Flex'
import Text from '../Text'

export type TableRowMarkerProps = {
  content: string | React.ReactNode
} & MarginProps

export default function TableRowMarker({ content, ...styleProps }: TableRowMarkerProps) {
  return (
    <Flex alignItems="center" justifyContent="center" height={1} as="tr" bg="primaryButtonBg" {...styleProps}>
      <Flex
        as="td"
        alignItems="center"
        justifyContent="center"
        px={3}
        py={1}
        bg="elevatedButtonBg"
        sx={{
          borderRadius: 'card',
          boxShadow: '10px 10px 10px elevatedShadowBg',
          border: '1px solid',
          borderColor: 'primaryButtonBg',
        }}
      >
        {React.isValidElement(content) ? content : <Text variant="secondary">{content}</Text>}
      </Flex>
    </Flex>
  )
}

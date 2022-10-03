import React from 'react'

import Flex, { FlexProps } from '../Flex'

type Props = {
  children?: React.ReactNode
} & FlexProps

export default function Center({ children, ...props }: Props) {
  return (
    <Flex {...props} alignItems="center" justifyContent="center">
      {children}
    </Flex>
  )
}

import React from 'react'

import Flex, { FlexProps } from '../Flex'

export type CardSectionProps = {
  children: React.ReactNode
  noPadding?: boolean
  noSpacing?: boolean
  isHorizontal?: boolean
  isVertical?: boolean
  isTransparent?: boolean
} & FlexProps

export type CardSectionElement = React.ReactElement<CardSectionProps>

export default function CardSection({
  children,
  noPadding,
  noSpacing,
  ...styleProps
}: CardSectionProps): CardSectionElement {
  return (
    <Flex
      flexDirection="column"
      px={!noPadding ? 6 : 0}
      pt={!noPadding ? 6 : 0}
      pb={!noPadding && !noSpacing ? 6 : 0}
      {...styleProps}
    >
      {children}
    </Flex>
  )
}

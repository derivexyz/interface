import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React from 'react'
import { Text as RebassText } from 'rebass'
import { FlexGrowProps } from 'styled-system'

export type TextVariant =
  | 'title'
  | 'subtitle'
  | 'heading'
  | 'cardHeading'
  | 'bodyMedium'
  | 'body'
  | 'bodyMedium'
  | 'small'
  | 'xs'

export type TextColor =
  | 'white'
  | 'text'
  | 'secondaryText'
  | 'primaryText'
  | 'errorText'
  | 'warningText'
  | 'disabledText'
  | 'inherit'

export type TextBaseProps = {
  variant?: TextVariant
  color?: TextColor
  textAlign?: 'left' | 'right' | 'center'
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

export type TextProps = TextBaseProps & {
  onClick?: React.ReactEventHandler<HTMLElement>
  children?: React.ReactNode
} & LayoutProps &
  MarginProps &
  FlexGrowProps

export type TextElement = React.ReactElement<TextProps>

const getDefaultAs = (variant?: TextVariant) => {
  switch (variant) {
    case 'title':
      return 'h1'
    case 'heading':
      return 'h2'
    case 'cardHeading':
      return 'h3'
    default:
      return 'p'
  }
}

export default function Text({
  children,
  variant,
  as = getDefaultAs(variant),
  color = 'inherit',
  onClick,
  ...styleProps
}: TextProps): TextElement {
  return (
    <RebassText {...styleProps} onClick={onClick} variant={variant} as={as} color={color}>
      {children}
    </RebassText>
  )
}

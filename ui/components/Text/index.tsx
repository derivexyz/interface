import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React from 'react'
import { Text as RebassText } from 'rebass'
import { FlexGrowProps } from 'styled-system'

export type TextVariant =
  | 'heroTitle'
  | 'heroHeading'
  | 'xlTitle'
  | 'largeTitle'
  | 'title'
  | 'heading'
  | 'heading2'
  | 'bodyLarge'
  | 'bodyLargeMedium'
  | 'body'
  | 'bodyMedium'
  | 'secondary'
  | 'secondaryMedium'
  | 'small'
  | 'smallMedium'

export type TextColor =
  | 'white'
  | 'text'
  | 'secondaryText'
  | 'primaryText'
  | 'errorText'
  | 'warningText'
  | 'disabledText'
  | 'invertedText'
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
    case 'largeTitle':
      return 'h1'
    case 'title':
      return 'h2'
    case 'heading':
      return 'h3'
    case 'heading2':
      return 'h4'
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

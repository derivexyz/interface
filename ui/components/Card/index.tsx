import Flex, { FlexProps } from '@lyra/ui/components/Flex'
import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React from 'react'

export type CardVariant = 'default' | 'elevated' | 'nested' | 'modal' | 'outline'

export type CardProps = {
  children?: React.ReactNode
  variant?: CardVariant
  onClick?: React.ReactEventHandler<HTMLDivElement>
  href?: string
  target?: string
} & FlexProps

export type CardElement = React.ReactElement<CardProps>

export const CardContext = React.createContext<CardVariant>('default')

const getVariant = (variant: CardVariant, isDarkMode: boolean, isMobile: boolean): string => {
  switch (variant) {
    case 'default':
      // light mode desktop uses card shadows
      return !isDarkMode && !isMobile ? 'cardShadowBg' : 'card'
    case 'nested':
      return 'cardNested'
    case 'elevated':
      return 'cardElevated'
    case 'outline':
      return 'cardOutlined'
    case 'modal':
      return 'cardModal'
  }
}

// eslint-disable-next-line react/display-name
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', onClick, href, target, ...styleProps }: CardProps, ref): CardElement => {
    const [isDarkMode] = useIsDarkMode()
    const isMobile = useIsMobile()
    return (
      <Flex
        target={target}
        href={href}
        ref={ref}
        onClick={onClick}
        flexDirection="column"
        {...styleProps}
        sx={{
          textDecoration: 'none',
          color: 'text',
          overflow: 'hidden',
          ':hover':
            onClick || href
              ? {
                  bg: 'cardNestedHover',
                  cursor: 'pointer',
                }
              : null,
          ':active':
            onClick || href
              ? {
                  bg: 'active',
                  cursor: 'pointer',
                }
              : null,
          ...(styleProps as any)?.sx,
        }}
        variant={getVariant(variant, isDarkMode, isMobile)}
      >
        {children}
      </Flex>
    )
  }
)

export default Card

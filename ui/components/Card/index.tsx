import Flex, { FlexProps } from '@lyra/ui/components/Flex'
import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import isExternalURL from '@lyra/ui/utils/isExternalURL'
import React from 'react'
import { useNavigate } from 'react-router-dom'

export type CardVariant = 'default' | 'elevated' | 'modal' | 'outline'

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
      return !isDarkMode && !isMobile ? 'cardShadowBg' : 'cardDefault'
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
  ({ children, variant = 'default', onClick, href, target = '_self', ...styleProps }: CardProps, ref): CardElement => {
    const [isDarkMode] = useIsDarkMode()
    const isMobile = useIsMobile()
    const navigate = useNavigate()
    return (
      <Flex
        ref={ref}
        onClick={e => {
          if (onClick) {
            onClick(e)
          }
          if (href) {
            if (isExternalURL(href)) {
              window.open(href, target)
            } else {
              navigate(href)
            }
          }
        }}
        flexDirection="column"
        {...styleProps}
        sx={{
          textDecoration: 'none',
          color: 'text',
          overflow: 'hidden',
          ':hover':
            onClick || href
              ? {
                  bg: 'cardHoverBg',
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

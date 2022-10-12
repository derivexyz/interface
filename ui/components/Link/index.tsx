import useFontSize from '@lyra/ui/hooks/useFontSize'
import useLineHeight from '@lyra/ui/hooks/useLineHeight'
import getVariantSX from '@lyra/ui/utils/getVariantSX'
import React from 'react'
import { Link as RebassLink } from 'rebass'
import { SxProps } from 'theme-ui'

import { IconType } from '../Icon'
import IconSVG from '../Icon/IconSVG'
import { TextProps, TextVariant } from '../Text'
import NextLink from './NextLink'

type LinkVariant = 'primary' | 'secondary'

type Props = {
  href?: string
  target?: string
  leftIcon?: IconType
  children?: React.ReactNode
  showRightIcon?: boolean
  variant?: LinkVariant
  textVariant?: TextVariant
} & Omit<TextProps, 'variant'> &
  SxProps

const getVariant = (variant: LinkVariant) => {
  switch (variant) {
    case 'primary':
      return 'primaryLink'
    case 'secondary':
      return 'secondaryLink'
  }
}

export default function Link({
  target,
  href,
  children,
  leftIcon,
  showRightIcon,
  variant = 'primary',
  textVariant = 'body',
  color,
  ...props
}: Props): JSX.Element | null {
  const fontSize = Math.floor(useFontSize(textVariant) * 0.8) // Apply some buffer to center icon
  const lineHeightSize = Math.floor(useLineHeight(textVariant) * 0.8) // Apply some buffer to center icon
  const textSx = getVariantSX('text.' + textVariant)
  if (isNaN(fontSize)) {
    console.warn('lineHeight / fontSize does not exist for variant')
    return null
  }
  return (
    <NextLink href={href}>
      <RebassLink
        variant={getVariant(variant)}
        href={href}
        target={target}
        {...props}
        sx={{
          ...textSx,
          display: leftIcon ? 'flex' : null,
          alignItems: leftIcon ? 'center' : null,
          color,
          cursor: 'pointer',
          ...props.sx,
        }}
      >
        {leftIcon ? (
          <>
            <IconSVG strokeWidth={3} size={lineHeightSize} icon={leftIcon} />
            &nbsp;&nbsp;
          </>
        ) : null}
        {children}
        {showRightIcon ? (
          <>
            &nbsp;
            <IconSVG
              strokeWidth={3}
              size={fontSize}
              icon={target === '_blank' ? IconType.ArrowUpRight : IconType.ArrowRight}
            />
          </>
        ) : null}
      </RebassLink>
    </NextLink>
  )
}

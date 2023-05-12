import useFontSx from '@lyra/ui/hooks/useFontSx'
import React from 'react'
import { Link as RebassLink } from 'rebass'
import { SxProps } from 'theme-ui'

import { IconType } from '../Icon'
import IconSVG from '../Icon/IconSVG'
import { TextColor, TextProps } from '../Text'
import BaseLink from './BaseLink'

type Props = {
  href?: string
  target?: string
  leftIcon?: IconType
  children?: React.ReactNode
  showRightIcon?: boolean
} & TextProps &
  SxProps

const getLinkVariant = (color: TextColor): string => {
  switch (color) {
    case 'secondaryText':
      return 'linkSecondary'
    case 'errorText':
      return 'linkError'
    case 'primaryText':
      return 'linkPrimary'
    case 'warningText':
      return 'linkWarning'
    case 'text':
    case 'inherit':
    case 'white':
    case 'disabledText':
      return 'link'
  }
}

export default function Link({
  target,
  href,
  children,
  leftIcon,
  showRightIcon,
  variant = 'body',
  color = 'primaryText',
  ...props
}: Props): JSX.Element | null {
  const fontSx = useFontSx(variant)

  return (
    <RebassLink
      as={BaseLink}
      variant={getLinkVariant(color)}
      href={href}
      target={target}
      {...props}
      sx={{
        display: leftIcon ? 'flex' : null,
        alignItems: leftIcon ? 'center' : null,
        ...fontSx,
        ...props.sx,
      }}
    >
      {leftIcon ? (
        <>
          <IconSVG strokeWidth={3} size={10} icon={leftIcon} />
          &nbsp;&nbsp;
        </>
      ) : null}
      {children}
      {showRightIcon ? (
        <>
          &nbsp;
          <IconSVG strokeWidth={3} size={10} icon={target === '_blank' ? IconType.ArrowUpRight : IconType.ArrowRight} />
        </>
      ) : null}
    </RebassLink>
  )
}

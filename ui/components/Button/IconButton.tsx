import React from 'react'
import { Button as RebassButton } from 'rebass'

import { LayoutProps, MarginProps } from '../../types'
import IconOrImage from '../Icon/IconOrImage'
import { IconType } from '../Icon/IconSVG'
import NextLink from '../Link/NextLink'
import { TextVariant } from '../Text'
import { ButtonSize, ButtonVariant, getButtonIconSize, getButtonSizeSx, getButtonVariant } from '.'

export type IconButtonProps = {
  icon: IconType | string | React.ReactNode
  size?: ButtonSize
  target?: string
  href?: string
  variant?: ButtonVariant
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  isOutline?: boolean
  isDisabled?: boolean
  isTransparent?: boolean
  type?: string
  textVariant?: TextVariant
} & MarginProps &
  LayoutProps

// eslint-disable-next-line react/display-name
const IconButton = React.forwardRef(
  (
    {
      icon,
      onClick,
      href,
      target,
      type,
      variant = 'default',
      size = 'medium',
      isOutline,
      isDisabled,
      isTransparent,
      ...marginProps
    }: IconButtonProps,
    ref
  ) => {
    const sizeSx = getButtonSizeSx(size)
    const buttonVariant = getButtonVariant(variant, isOutline, isTransparent, isDisabled)

    return (
      <NextLink href={href}>
        <RebassButton
          ref={ref}
          as={href != null ? 'a' : 'button'}
          disabled={isDisabled}
          onClick={onClick}
          href={href}
          target={target}
          type={type}
          display={'flex'}
          justifyContent="center"
          alignItems={'center'}
          variant={buttonVariant}
          {...marginProps}
          sx={{ ...sizeSx }}
          p={0}
          minWidth={sizeSx.height}
        >
          {typeof icon === 'string' ? <IconOrImage src={icon} size={getButtonIconSize(size)} /> : icon}
        </RebassButton>
      </NextLink>
    )
  }
)

export default IconButton

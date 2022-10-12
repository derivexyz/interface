import getVariantSX from '@lyra/ui/utils/getVariantSX'
import React from 'react'
import { Button as RebassButton } from 'rebass'
import { LayoutProps, MarginProps, PaddingProps } from 'styled-system'

import Box from '../Box'
import Center from '../Center'
import Flex from '../Flex'
import IconOrImage from '../Icon/IconOrImage'
import { IconType } from '../Icon/IconSVG'
import NextLink from '../Link/NextLink'
import Spinner, { SpinnerSize, SpinnerVariant } from '../Spinner'
import Text, { TextColor, TextVariant } from '../Text'

export type ButtonSize = 'sm' | 'small' | 'md' | 'medium' | 'lg' | 'large'

export type ButtonVariant = 'default' | 'primary' | 'error' | 'light' | 'warning' | 'white' | 'static' | 'elevated'

export type ButtonJustify = 'left' | 'right' | 'center'

export type BaseButtonProps = {
  label: string | React.ReactNode
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
  textAlign?: 'left' | 'center' | 'right'
  leftIcon?: IconType | React.ReactNode
  rightIcon?: IconType | React.ReactNode
  leftIconSpacing?: number
  rightIconSpacing?: number
  showRightIconSeparator?: boolean
  isLoading?: boolean
  textColor?: TextColor
  justify?: ButtonJustify
}

export type ButtonProps = BaseButtonProps & PaddingProps & Omit<MarginProps & LayoutProps, 'height' | 'h' | 'size'>

export type ButtonElement = React.ReactElement<ButtonProps>

export const getButtonSizeSx = (size: ButtonSize): Record<string, string | number> => {
  switch (size) {
    case 'small':
    case 'sm':
      return {
        fontFamily: 'body',
        fontWeight: 'medium',
        fontSize: '11px',
        height: '24px',
        textTransform: 'uppercase',
        px: 2,
      }
    case 'medium':
    case 'md':
      return {
        fontFamily: 'body',
        fontWeight: 'medium',
        fontSize: '15px',
        height: '36px',
        px: 3,
      }
    case 'large':
    case 'lg':
      return {
        fontFamily: 'heading',
        fontWeight: 'medium',
        fontSize: '16px',
        height: '58px',
        px: 3,
      }
  }
}

export const getButtonIconSize = (size: ButtonSize): string => {
  switch (size) {
    case 'small':
    case 'sm':
      return '14px'
    case 'medium':
    case 'md':
      return '16px'
    case 'large':
    case 'lg':
      return '18px'
  }
}

const getButtonJustify = (align: ButtonJustify): string => {
  switch (align) {
    case 'left':
      return 'flex-start'
    case 'center':
      return 'center'
    case 'right':
      return 'flex-end'
  }
}

const getSpinnerSize = (size: ButtonSize): SpinnerSize => {
  switch (size) {
    case 'small':
    case 'sm':
      return 12
    case 'medium':
    case 'md':
      return 18
    case 'large':
    case 'lg':
      return 24
  }
}

const getSpinnerVariant = (variant: ButtonVariant): SpinnerVariant => {
  switch (variant) {
    case 'default':
    case 'light':
    case 'static':
    case 'white':
    case 'elevated':
      return 'light'
    case 'primary':
      return 'primary'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
  }
}

export const getButtonVariant = (
  variant: ButtonVariant,
  isOutline?: boolean,
  isTransparent?: boolean,
  isDisabled?: boolean
): string => {
  return isDisabled
    ? 'buttons.disabled'
    : `buttons.${variant}` + (isOutline ? 'Outline' : isTransparent ? 'Transparent' : '')
}

// eslint-disable-next-line react/display-name
const Button = React.forwardRef(
  (
    {
      label,
      justify = 'center',
      onClick,
      href,
      target,
      type,
      variant = 'default',
      size = 'medium',
      textAlign = 'center',
      isOutline,
      isTransparent,
      isDisabled,
      isLoading,
      leftIcon,
      leftIconSpacing,
      rightIcon,
      rightIconSpacing,
      textVariant,
      textColor,
      showRightIconSeparator = false,
      ...styleProps
    }: ButtonProps,
    ref
  ): ButtonElement => {
    const buttonVariant = getButtonVariant(variant, isOutline, isTransparent, isDisabled)
    const sizeSx = getButtonSizeSx(size)
    const buttonSx = getVariantSX(buttonVariant)

    // HACK: Ensure fontSize in theme always refers to direct value
    const iconSize = getButtonIconSize(size)
    const left =
      leftIcon || isLoading ? (
        <Flex justifyContent={'flex-start'} pr={2} flexGrow={leftIconSpacing}>
          {leftIcon ? (
            typeof leftIcon === 'string' ? (
              <IconOrImage src={leftIcon} size={iconSize} />
            ) : (
              <Center>{leftIcon}</Center>
            )
          ) : (
            <Spinner size={getSpinnerSize(size)} variant={getSpinnerVariant(variant)} />
          )}
        </Flex>
      ) : null

    const right = rightIcon ? (
      <Flex justifyContent={'flex-end'} flexGrow={rightIconSpacing} pl={2}>
        {typeof rightIcon === 'string' ? <IconOrImage src={rightIcon} size={iconSize} /> : rightIcon}
      </Flex>
    ) : null

    return (
      <NextLink href={href}>
        <RebassButton
          ref={ref}
          as={href != null ? 'a' : 'button'}
          href={href}
          target={target}
          display="flex"
          alignItems="center"
          type={type}
          justifyContent={getButtonJustify(justify)}
          className={isDisabled || isLoading ? 'disabled' : undefined}
          onClick={!isDisabled && !isLoading ? onClick : undefined}
          {...styleProps}
          variant={buttonVariant}
          sx={{
            ...sizeSx,
            cursor: isDisabled ? 'not-allowed' : isLoading ? 'default' : 'pointer',
          }}
          opacity={isLoading ? 0.8 : 1.0}
        >
          {left}
          {/* TODO: @dappbeast Fix this hack */}
          <Box mx={showRightIconSeparator ? 'auto' : 'none'}>
            {React.isValidElement(label) ? (
              label
            ) : textVariant ? (
              <Text color={textColor ?? 'inherit'} variant={textVariant} textAlign={textAlign}>
                {label}
              </Text>
            ) : (
              label
            )}
          </Box>
          {showRightIconSeparator ? (
            <Box ml="auto" height={sizeSx.height} width="1px" bg={isOutline ? buttonSx.borderColor : 'background'} />
          ) : null}
          {right}
        </RebassButton>
      </NextLink>
    )
  }
)

export default Button

import getVariantSX from '@lyra/ui/utils/getVariantSX'
import React, { useCallback, useState } from 'react'
import { Button as RebassButton } from 'rebass'
import { LayoutProps, MarginProps, PaddingProps } from 'styled-system'

import Box from '../Box'
import Center from '../Center'
import Flex from '../Flex'
import IconOrImage from '../Icon/IconOrImage'
import { IconType } from '../Icon/IconSVG'
import BaseLink from '../Link/BaseLink'
import Spinner, { SpinnerSize, SpinnerVariant } from '../Spinner'
import Text, { TextColor, TextVariant } from '../Text'

export type ButtonSize = 'sm' | 'small' | 'md' | 'medium' | 'lg' | 'large'

export type ButtonVariant = 'default' | 'primary' | 'error' | 'light' | 'warning' | 'white' | 'static' | 'elevated'

export type ButtonJustify = 'left' | 'right' | 'center'

export type ButtonClickHandler = (
  event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
) => void | Promise<void>

export type BaseButtonProps = {
  label: string | React.ReactNode
  size?: ButtonSize
  target?: string
  href?: string
  variant?: ButtonVariant
  onClick?: ButtonClickHandler
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
  noPadding?: boolean
}

export type ButtonProps = BaseButtonProps & PaddingProps & Omit<MarginProps & LayoutProps, 'size'>

export type ButtonElement = React.ReactElement<ButtonProps>

export const getButtonSizeSx = (size: ButtonSize): Record<string, string | number> => {
  switch (size) {
    case 'small':
    case 'sm':
      return {
        fontFamily: 'body',
        fontWeight: 'medium',
        fontSize: '11px',
        lineHeight: '11px',
        minHeight: '22px',
        borderRadius: 'text',
        p: 0,
      }
    case 'medium':
    case 'md':
      return {
        fontFamily: 'body',
        fontWeight: 'medium',
        fontSize: '15px',
        lineHeight: '15px',
        minHeight: '36px',
        borderRadius: '18px',
        p: 0,
      }
    case 'large':
    case 'lg':
      return {
        fontFamily: 'heading',
        fontWeight: 'medium',
        fontSize: '16px',
        lineHeight: '16px',
        minHeight: '56px',
        borderRadius: '28px',
        p: 0,
      }
  }
}

const EMPTY_PADDING = { px: 0, py: 0 }

export const getButtonPaddingSx = (size: ButtonSize): Record<string, string | number> => {
  switch (size) {
    case 'small':
    case 'sm':
      return {
        px: 1,
        py: 0,
      }
    case 'medium':
    case 'md':
      return {
        px: 2,
        py: 1,
      }
    case 'large':
    case 'lg':
      return {
        px: 3,
        py: 2,
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
      isLoading: injectedIsLoading,
      leftIcon,
      leftIconSpacing,
      rightIcon,
      rightIconSpacing,
      textVariant,
      textColor,
      showRightIconSeparator = false,
      noPadding,
      ...styleProps
    }: ButtonProps,
    ref
  ): ButtonElement => {
    const buttonVariant = getButtonVariant(variant, isOutline, isTransparent, isDisabled)
    const sizeSx = getButtonSizeSx(size)
    const paddingSx = !noPadding ? getButtonPaddingSx(size) : EMPTY_PADDING
    const buttonSx = getVariantSX(buttonVariant)

    const [overrideIsLoading, setOverrideIsLoading] = useState(false)
    const isLoading = overrideIsLoading || injectedIsLoading

    const handleClick: ButtonClickHandler = useCallback(
      e => {
        if (onClick && !isLoading && !isDisabled) {
          if (typeof (onClick as any).then === 'function' || onClick.constructor.name === 'AsyncFunction') {
            const onClickProm = onClick as (
              event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
            ) => Promise<void>
            setOverrideIsLoading(true)
            onClickProm(e)
              .then(() => setOverrideIsLoading(false))
              .catch(err => {
                setOverrideIsLoading(false)
                throw err
              })
          } else {
            onClick(e)
          }
        }
      },
      [isDisabled, isLoading, onClick]
    )

    // HACK: Ensure fontSize in theme always refers to direct value
    const iconSize = getButtonIconSize(size)
    const left =
      leftIcon || isLoading ? (
        <Flex
          justifyContent={'flex-start'}
          alignItems="center"
          flexGrow={leftIconSpacing}
          py={paddingSx.py}
          pl={paddingSx.px}
        >
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
      <Flex flexGrow={rightIconSpacing} justifyContent={'flex-end'} alignItems="center" pr={paddingSx.px}>
        {showRightIconSeparator ? (
          <Box
            mr={paddingSx.px}
            ml="auto"
            height="100%"
            minWidth="1px"
            bg={isOutline ? buttonSx.borderColor : 'background'}
          />
        ) : null}
        <Flex py={paddingSx.py} justifyContent={'flex-end'} alignItems="center">
          {typeof rightIcon === 'string' ? <IconOrImage src={rightIcon} size={iconSize} /> : rightIcon}
        </Flex>
      </Flex>
    ) : null

    return (
      <RebassButton
        ref={ref}
        as={href != null ? BaseLink : 'button'}
        href={href}
        target={target}
        display="flex"
        type={type}
        justifyContent={getButtonJustify(justify)}
        className={isDisabled || isLoading ? 'disabled' : undefined}
        onClick={handleClick}
        variant={buttonVariant}
        {...styleProps}
        sx={{
          ...(styleProps as any).sx,
          ...sizeSx,
          cursor: isDisabled ? 'not-allowed' : isLoading ? 'default' : 'pointer',
          alignItems: 'stretch',
        }}
        opacity={isLoading ? 0.8 : 1.0}
      >
        {left}
        <Flex sx={paddingSx} alignItems="center" mx={showRightIconSeparator ? 'auto' : 'none'}>
          {React.isValidElement(label) ? (
            label
          ) : (
            <Text color={textColor ?? 'inherit'} variant={textVariant} textAlign={textAlign}>
              {label}
            </Text>
          )}
        </Flex>
        {right}
      </RebassButton>
    )
  }
)

export default Button

import React, { useCallback, useState } from 'react'
import { Button as RebassButton } from 'rebass'

import { LayoutProps, MarginProps } from '../../types'
import IconOrImage from '../Icon/IconOrImage'
import { IconType } from '../Icon/IconSVG'
import BaseLink from '../Link/BaseLink'
import Spinner from '../Spinner'
import { TextVariant } from '../Text'
import { ButtonClickHandler, ButtonSize, ButtonVariant, getButtonIconSize, getButtonSizeSx, getButtonVariant } from '.'

export type IconButtonProps = {
  icon: IconType | string | React.ReactNode
  size?: ButtonSize
  target?: string
  href?: string
  variant?: ButtonVariant
  onClick?: ButtonClickHandler
  isOutline?: boolean
  isDisabled?: boolean
  isTransparent?: boolean
  isLoading?: boolean
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
      isLoading: injectedIsLoading,
      ...styleProps
    }: IconButtonProps,
    ref
  ) => {
    const sizeSx = getButtonSizeSx(size)
    const buttonVariant = getButtonVariant(variant, isOutline, isTransparent, isDisabled)

    const sizeStr = getButtonIconSize(size)
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

    return (
      <RebassButton
        ref={ref}
        as={href ? BaseLink : 'button'}
        className={isDisabled || isLoading ? 'disabled' : undefined}
        onClick={handleClick}
        href={href}
        target={target}
        type={type}
        display={'flex'}
        justifyContent="center"
        alignItems={'center'}
        variant={buttonVariant}
        {...styleProps}
        sx={{
          ...(styleProps as any).sx,
          ...sizeSx,
          cursor: isDisabled ? 'not-allowed' : isLoading ? 'default' : 'pointer',
        }}
        p={0}
        minWidth={sizeSx.minHeight}
      >
        {!isLoading ? (
          typeof icon === 'string' ? (
            <IconOrImage src={icon} size={sizeStr} />
          ) : (
            icon
          )
        ) : (
          <Spinner size={sizeStr} />
        )}
      </RebassButton>
    )
  }
)

export default IconButton

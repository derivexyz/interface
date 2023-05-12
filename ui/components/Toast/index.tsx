import React from 'react'
import { toast, ToastContentProps, ToastOptions, UpdateOptions } from 'react-toastify'
import { Box, Flex, Text } from 'rebass'

import { ButtonVariant } from '../Button'
import IconButton from '../Button/IconButton'
import IconOrImage from '../Icon/IconOrImage'
import { IconType } from '../Icon/IconSVG'
import Link from '../Link'

const PROGRESS_STYLE = { background: 'rgba(255, 255, 255, 0.25)', height: '4px' }

export type ToastVariant = 'info' | 'success' | 'error' | 'warning'

type ToastRenderOptions = {
  variant?: ToastVariant
  icon?: IconType | React.ReactNode
  description?: React.ReactNode
  hrefLabel?: React.ReactNode
  href?: string
  target?: string
}

export type ToastProps = ToastContentProps & ToastRenderOptions

export type CreateToastOptions = ToastRenderOptions & Omit<ToastOptions, 'type'>
export type UpdateToastOptions = ToastRenderOptions & Omit<UpdateOptions, 'render'>

export function createToast(options: CreateToastOptions): string {
  const { icon, description, hrefLabel, href, target, variant, autoClose = false, ...toastOptions } = options
  const toastId = toast(
    ({ toastProps, closeToast }) => (
      <Toast
        variant={variant}
        icon={icon}
        description={description}
        hrefLabel={hrefLabel}
        href={href}
        target={target}
        toastProps={toastProps}
        closeToast={closeToast}
      />
    ),
    {
      ...toastOptions,
      autoClose,
      closeOnClick: false,
      draggable: false,
      progressStyle: PROGRESS_STYLE,
    }
  )
  return toastId as string
}

export function updateToast(toastId: string, options: UpdateToastOptions) {
  const { icon, description, href, hrefLabel, target, variant, autoClose = false, ...updateOptions } = options
  if (toast.isActive(toastId)) {
    toast.update(toastId, {
      ...updateOptions,
      autoClose,
      progressStyle: PROGRESS_STYLE,
      draggable: false,
      closeOnClick: false,
      render: ({ toastProps, closeToast }) => (
        <Toast
          variant={variant}
          icon={icon}
          description={description}
          href={href}
          hrefLabel={hrefLabel}
          target={target}
          toastProps={toastProps}
          closeToast={closeToast}
        />
      ),
    })
  } else {
    createToast({ icon, description, href, target, variant, autoClose: autoClose ?? undefined })
  }
}

export function closeToast(toastId: string): void {
  toast.dismiss(toastId)
}

const getToastVariantKey = (variant: ToastVariant): string => {
  switch (variant) {
    case 'info':
      return 'toastDefault'
    case 'success':
      return 'toastSuccess'
    case 'error':
      return 'toastError'
    case 'warning':
      return 'toastWarning'
  }
}

const getButtonVariant = (variant: ToastVariant): ButtonVariant => {
  switch (variant) {
    case 'info':
      return 'default'
    case 'success':
      return 'primary'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
  }
}

export default function Toast({
  variant = 'info',
  description,
  href,
  hrefLabel,
  target,
  icon,
  closeToast,
  toastProps: { autoClose },
}: ToastProps) {
  return (
    <Flex
      onClick={() => {
        if (href) {
          window.open(href, target)
        } else if (closeToast) {
          closeToast()
        }
      }}
      variant={getToastVariantKey(variant)}
      height={'100%'}
      alignItems="center"
      width="100%"
      pt={2}
      pb={autoClose ? '10px' : 2}
    >
      {icon ? (
        <Box ml={3} minWidth={20}>
          {typeof icon === 'string' ? (
            <IconOrImage size={20} color={variant === 'info' ? 'secondaryText' : 'white'} strokeWidth={2} src={icon} />
          ) : (
            icon
          )}
        </Box>
      ) : null}
      <Box mx={3}>
        <Text color="inherit" variant="small">
          {description}
          {href ? (
            <>
              &nbsp;
              <Link variant="small" showRightIcon color="inherit" href={href} target="_blank">
                {hrefLabel ?? 'View more'}
              </Link>
            </>
          ) : null}
        </Text>
      </Box>
      <IconButton
        ml="auto"
        mr={2}
        variant={getButtonVariant(variant)}
        icon={IconType.X}
        onClick={e => {
          if (closeToast) {
            e.preventDefault()
            e.nativeEvent.stopPropagation()
            e.stopPropagation()
            closeToast()
          }
        }}
      />
    </Flex>
  )
}

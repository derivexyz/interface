import React from 'react'
import { toast, ToastContentProps, ToastOptions, UpdateOptions } from 'react-toastify'
import { Box, Flex, Text } from 'rebass'

import { ButtonVariant } from '../Button'
import IconButton from '../Button/IconButton'
import IconOrImage from '../Icon/IconOrImage'
import { IconType } from '../Icon/IconSVG'
import BaseLink from '../Link/BaseLink'
import Spinner from '../Spinner'

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
      progressStyle: { background: 'rgba(255, 255, 255, 0.25)', height: '3.5px' },
    }
  )
  return toastId as string
}

export function createPendingToast(options: Omit<CreateToastOptions, 'variant'>): string {
  const { autoClose = false } = options
  return createToast({
    variant: 'info',
    icon: <Spinner size={20} />,
    autoClose,
    ...options,
  })
}

export function updatePendingToast(toastId: string, options: Omit<UpdateToastOptions, 'variant'>): void {
  updateToast(toastId, {
    variant: 'info',
    icon: <Spinner size={20} />,
    ...options,
  })
}

export function updateToast(toastId: string, options: UpdateToastOptions) {
  const { icon, description, href, target, variant, autoClose = false, ...updateOptions } = options
  if (toast.isActive(toastId)) {
    toast.update(toastId, {
      ...updateOptions,
      autoClose,
      progressStyle: { background: 'rgba(255, 255, 255, 0.25)', height: '3.5px' },
      draggable: false,
      closeOnClick: false,
      render: ({ toastProps, closeToast }) => (
        <Toast
          variant={variant}
          icon={icon}
          description={description}
          href={href}
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
  hrefLabel,
  href,
  target,
  icon,
  closeToast,
}: ToastProps) {
  return (
    <Flex
      onClick={() => {
        if (closeToast) {
          closeToast()
        }
      }}
      as={href ? BaseLink : 'div'}
      href={href}
      target={target}
      variant={getToastVariantKey(variant)}
      height={'100%'}
      alignItems="center"
      width="100%"
      py={2}
      px={3}
    >
      {icon ? (
        <Box mr={2} minWidth={20}>
          {typeof icon === 'string' ? (
            <IconOrImage size={20} color={variant === 'info' ? 'secondaryText' : 'white'} strokeWidth={2} src={icon} />
          ) : (
            icon
          )}
        </Box>
      ) : null}
      <Text mr={2} color="inherit" variant="secondary" fontWeight={'medium'}>
        {description}{' '}
        <Text
          as="span"
          color="inherit"
          sx={{ textDecoration: 'underline', display: 'inline' }}
          variant="secondary"
          fontWeight={'medium'}
        >
          {hrefLabel}
        </Text>
      </Text>
      <IconButton
        ml="auto"
        size="sm"
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

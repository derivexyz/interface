import { Input as RebassInput } from '@rebass/forms'
import React, { ChangeEventHandler, FocusEventHandler, useEffect, useRef, useState } from 'react'
import { FlexGrowProps, LayoutProps, MarginProps } from 'styled-system'

import Box from '../Box'
import Flex from '../Flex'
import Text from '../Text'

export type HTMLInputProps = {
  value: string | number | readonly string[] | undefined
  placeholder?: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onFocus?: FocusEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  autoFocus?: boolean
  type?: string
}

export type InputProps = {
  variant?: string
  label?: string
  error?: false | string
  isSuccess?: boolean
  onError?: (error: false | string | null) => void
  rightContent?: React.ReactNode
  icon?: React.ReactNode
  isDisabled?: boolean
  textAlign?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent'
  isTransparent?: boolean
} & HTMLInputProps &
  MarginProps &
  LayoutProps &
  FlexGrowProps

export type InputElement = React.ReactElement<InputProps>

export default function Input({
  label,
  rightContent,
  icon,
  error,
  isSuccess: success,
  onError,
  value,
  onChange,
  placeholder,
  autoFocus,
  type,
  onBlur,
  onFocus,
  isDisabled,
  textAlign,
  ...styleProps
}: InputProps): InputElement {
  const [_isFocused, setIsFocused] = useState(false)
  const handleBlur: FocusEventHandler<HTMLInputElement> = e => {
    setIsFocused(false)
    if (onBlur != null) {
      onBlur(e)
    }
  }
  const handleFocus: FocusEventHandler<HTMLInputElement> = e => {
    setIsFocused(true)
    if (onFocus != null) {
      onFocus(e)
    }
  }
  useEffect(() => {
    if (onError) {
      onError(error ?? null)
    }
  }, [error, onError])
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <Box {...styleProps} sx={{ position: 'relative' }}>
      {label != null && (
        <Text mx={2} mb={1} variant="small" color={error ? 'errorText' : 'secondaryText'}>
          {label}
        </Text>
      )}
      <Flex
        alignItems="center"
        variant="inputContainer"
        sx={{
          bg: _isFocused ? 'buttonBackground' : undefined,
          borderColor: error ? 'inputError' : success ? 'inputSuccess' : _isFocused && !!value ? 'outline' : undefined,
          cursor: isDisabled ? 'not-allowed' : 'text',
        }}
        onClick={() => {
          inputRef.current?.focus()
        }}
      >
        {icon != null && (
          <Flex alignItems="center" px={3}>
            {typeof icon === 'string' ? <Text variant="secondary">{icon}</Text> : icon}
          </Flex>
        )}
        <RebassInput
          ref={inputRef}
          onWheel={e => e.currentTarget.blur()}
          onBlur={handleBlur}
          onFocus={handleFocus}
          flex={1}
          pl={!icon ? 3 : 0}
          pr={!rightContent ? 3 : 0}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          type={type}
          disabled={isDisabled}
          minHeight="35px"
          height="100%"
          sx={{ textAlign }}
        />
        {rightContent != null && (
          <Flex ml={1} alignItems="center" mr={3}>
            {typeof rightContent === 'string' ? <Text variant="secondary">{rightContent}</Text> : rightContent}
          </Flex>
        )}
      </Flex>
    </Box>
  )
}

import { Textarea } from '@rebass/forms'
import React, { ChangeEventHandler, FocusEventHandler, useEffect, useRef, useState } from 'react'
import { FlexGrowProps, LayoutProps, MarginProps } from 'styled-system'

import Box from '../Box'
import Flex from '../Flex'
import Text, { TextVariant } from '../Text'

export type HTMLTextAreaProps = {
  value: string | number | readonly string[] | undefined
  placeholder?: string
  onChange: ChangeEventHandler<HTMLTextAreaElement>
  onFocus?: FocusEventHandler<HTMLTextAreaElement>
  onBlur?: FocusEventHandler<HTMLTextAreaElement>
  autoFocus?: boolean
  type?: string
}

export type TextAreaProps = {
  variant?: TextVariant
  label?: string
  error?: false | string
  isSuccess?: boolean
  onError?: (error: false | string | null) => void
  isDisabled?: boolean
  textAlign?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent'
  isTransparent?: boolean
} & HTMLTextAreaProps &
  MarginProps &
  LayoutProps &
  FlexGrowProps

export type TextAreaElement = React.ReactElement<TextAreaProps>

export default function TextArea({
  label,
  error,
  isSuccess: success,
  onError,
  value,
  onChange,
  placeholder,
  autoFocus,
  onBlur,
  onFocus,
  isDisabled,
  textAlign,
  ...styleProps
}: TextAreaProps): TextAreaElement {
  const [_isFocused, setIsFocused] = useState(false)
  const handleBlur: FocusEventHandler<HTMLTextAreaElement> = e => {
    setIsFocused(false)
    if (onBlur != null) {
      onBlur(e)
    }
  }
  const handleFocus: FocusEventHandler<HTMLTextAreaElement> = e => {
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
  const inputRef = useRef<HTMLTextAreaElement>(null)
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
        <Textarea
          ref={inputRef}
          onWheel={e => e.currentTarget.blur()}
          onBlur={handleBlur}
          onFocus={handleFocus}
          p={3}
          flex={1}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={isDisabled}
          minHeight="70px"
          height="100%"
          sx={{ textAlign }}
        />
      </Flex>
    </Box>
  )
}

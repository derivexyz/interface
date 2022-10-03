import { BigNumber } from '@ethersproject/bignumber'
import emptyFunction from '@lyra/ui/utils/emptyFunction'
import formatNumber from '@lyra/ui/utils/formatNumber'
import fromBigNumber from '@lyra/ui/utils/fromBigNumber'
import toBigNumber from '@lyra/ui/utils/toBigNumber'
import React, { useCallback, useEffect, useState } from 'react'

import Flex from '../Flex'
import Link from '../Link'
import Input, { InputProps } from '.'

const MAX_BN = BigNumber.from(2).pow(256).sub(1)
const MIN_BN = BigNumber.from(2).pow(256).sub(1).mul(-1)
const ZERO_BN = BigNumber.from(0)

export type Props = {
  value: BigNumber
  placeholder?: BigNumber | string
  onChange: (value: BigNumber) => void
  min?: BigNumber
  max?: BigNumber
  customMaxMessage?: string
  customMinMessage?: string
  decimals?: number
  showMaxButton?: boolean
  // onEmpty handler takes priority over "defaultValue"
  onEmpty?: () => void
  defaultValue?: BigNumber
} & Omit<InputProps, 'placeholder' | 'value' | 'onChange' | 'type' | 'error' | 'onError'>

export default function BigNumberInput({
  value,
  onChange,
  min = MIN_BN,
  max = MAX_BN,
  decimals = 18,
  placeholder = ZERO_BN,
  onBlur = emptyFunction,
  onFocus = emptyFunction,
  customMaxMessage,
  customMinMessage,
  autoFocus,
  defaultValue = ZERO_BN,
  onEmpty,
  showMaxButton,
  ...inputProps
}: Props): JSX.Element {
  const [error, setError] = useState<string | false>(false)
  const [rawValue, setRawValue] = useState('')
  const checkError = useCallback(
    (value: BigNumber) => {
      let error: string | false = false
      if (value.gt(max)) {
        error = customMaxMessage ?? 'Input is too large'
      } else if (value.lt(min)) {
        error = customMinMessage ?? 'Input is too small'
      } else {
        setError(false)
      }
      setError(error)
      return error
    },
    [setError, customMaxMessage, customMinMessage, max, min]
  )

  useEffect(() => {
    // Check for any dynamic value updates
    checkError(value)
    const rawValueBN = toBigNumber(rawValue, decimals)
    if ((rawValueBN && !value.eq(rawValueBN)) || (rawValue === '' && !value.isZero())) {
      setRawValue(fromBigNumber(value, decimals).toString())
    }
  }, [value, checkError, decimals, rawValue])

  const placeholderStr = BigNumber.isBigNumber(placeholder)
    ? formatNumber(fromBigNumber(placeholder, decimals), { minDps: 1 })
    : placeholder

  return (
    <Input
      {...inputProps}
      value={rawValue}
      placeholder={placeholderStr}
      onChange={evt => {
        // type="number" ensures inputVal is a valid number or ''
        const inputVal = evt.target.value
        setRawValue(inputVal)
        if (inputVal) {
          const bn = toBigNumber(inputVal, decimals)
          if (bn !== null) {
            onChange(bn)
            checkError(bn)
            return
          }
        } else {
          if (onEmpty) {
            onEmpty()
          } else {
            onChange(defaultValue)
          }
        }
      }}
      autoFocus={autoFocus}
      type="number"
      onFocus={e => {
        onFocus(e)
        checkError(value)
      }}
      onBlur={e => {
        onBlur(e)
        checkError(value)
      }}
      error={error}
      rightContent={
        <Flex alignItems="center">
          {inputProps.rightContent}
          {showMaxButton ? (
            <Link
              ml={2}
              textVariant="smallMedium"
              variant="secondary"
              onClick={e => {
                e.preventDefault()
                if (onChange) {
                  onChange(max ?? ZERO_BN)
                }
              }}
            >
              MAX
            </Link>
          ) : null}
        </Flex>
      }
    />
  )
}

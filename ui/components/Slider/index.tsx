import { Slider as RebassSlider } from '@rebass/forms'
import React from 'react'

import Box from '../Box'
import Flex, { FlexProps } from '../Flex'
import Link from '../Link'

export type SliderProps = {
  value: number
  max: number
  min: number
  step?: number
  minButtonLabel?: string
  maxButtonLabel?: string
  onClickMin?: () => void
  onClickMax?: () => void
  onChange: (value: number) => void
  onBlur?: React.FocusEventHandler<HTMLInputElement>
} & FlexProps

export type SliderElement = React.ReactElement<SliderProps>

export default function Slider({
  value,
  max,
  min,
  maxButtonLabel,
  minButtonLabel,
  step = 0,
  onChange,
  onClickMax,
  onClickMin,
  ...styleProps
}: SliderProps): SliderElement {
  return (
    <Flex {...styleProps} sx={{ position: 'relative' }}>
      {minButtonLabel ? (
        <>
          <Link
            textVariant="small"
            variant="secondary"
            sx={{
              position: 'absolute',
              top: 5,
              left: 0,
              color: value === min ? 'text' : 'secondaryText',
            }}
            onClick={onClickMin}
          >
            {minButtonLabel}
          </Link>
          <Box
            sx={{ position: 'absolute', width: '2px', height: '8px', top: '5px', left: '0px', bg: 'toggleTrackBg' }}
          />
        </>
      ) : null}
      <RebassSlider
        value={value}
        max={max}
        min={min}
        step={step}
        onChange={e => onChange(parseFloat(e.target.value))}
        height={'2px'}
        bg="toggleTrackBg"
        sx={{
          zIndex: 1,
          '::-webkit-slider-thumb': {
            height: '12px',
            width: '12px',
            bg: 'toggleThumbBg',
          },
        }}
        mb={minButtonLabel || maxButtonLabel ? 7 : 0}
      />
      {maxButtonLabel ? (
        <>
          <Link
            textVariant="small"
            variant="secondary"
            sx={{
              position: 'absolute',
              top: 5,
              right: 0,
              color: value === max ? 'text' : 'secondaryText',
            }}
            onClick={onClickMax}
          >
            {maxButtonLabel}
          </Link>

          <Box
            sx={{ position: 'absolute', width: '2px', height: '8px', top: '5px', right: '0px', bg: 'toggleTrackBg' }}
          />
        </>
      ) : null}
    </Flex>
  )
}

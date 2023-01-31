import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import ToggleButtonItem from '@lyra/ui/components/Button/ToggleButtonItem'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React from 'react'

import { ChartInterval } from '@/app/constants/chart'
import formatInterval from '@/app/utils/formatInterval'

const CHART_INTERVAL_DEFAULT = [
  ChartInterval.OneDay,
  ChartInterval.OneWeek,
  ChartInterval.OneMonth,
  ChartInterval.SixMonths,
]

type ChartIntervalSelectorProps = {
  selectedInterval: ChartInterval
  onChangeInterval: (interval: ChartInterval) => void
  intervals?: ChartInterval[]
} & MarginProps &
  LayoutProps

const ChartIntervalSelector = ({
  selectedInterval,
  onChangeInterval,
  intervals = CHART_INTERVAL_DEFAULT,
  ...styleProps
}: ChartIntervalSelectorProps) => {
  return (
    <ToggleButton {...styleProps}>
      {intervals.map(interval => (
        <ToggleButtonItem
          key={interval}
          id={interval}
          label={formatInterval(interval)}
          isSelected={interval === selectedInterval}
          onSelect={onChangeInterval}
          textVariant="secondaryMedium"
        />
      ))}
    </ToggleButton>
  )
}

export default ChartIntervalSelector

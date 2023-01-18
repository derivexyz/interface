import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import ToggleButtonItem from '@lyra/ui/components/Button/ToggleButtonItem'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React from 'react'

import { ChartPeriod } from '@/app/constants/chart'
import formatPeriod from '@/app/utils/formatPeriod'

const CHART_PERIOD_DEFAULT = [ChartPeriod.OneDay, ChartPeriod.OneWeek, ChartPeriod.OneMonth, ChartPeriod.SixMonths]

type ChartPeriodSelectorProps = {
  selectedPeriod: ChartPeriod
  onChangePeriod: (period: ChartPeriod) => void
  periods?: ChartPeriod[]
} & MarginProps &
  LayoutProps

const ChartPeriodSelector = ({
  selectedPeriod,
  onChangePeriod,
  periods = CHART_PERIOD_DEFAULT,
  ...styleProps
}: ChartPeriodSelectorProps) => {
  return (
    <ToggleButton {...styleProps}>
      {periods.map(period => (
        <ToggleButtonItem
          key={period}
          id={period}
          label={formatPeriod(period)}
          isSelected={period === selectedPeriod}
          onSelect={onChangePeriod}
          textVariant="secondaryMedium"
        />
      ))}
    </ToggleButton>
  )
}

export default ChartPeriodSelector

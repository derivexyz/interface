import { ChartPeriod } from '@lyra/app/constants/chart'
import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React from 'react'

import getPeriodStr from '@/app/utils/getPeriodStr'

const CHART_PERIOD_DEFAULT = [ChartPeriod.OneDay, ChartPeriod.OneWeek, ChartPeriod.OneMonth, ChartPeriod.SixMonths]

type ChartPeriodSelectorProps = {
  period: ChartPeriod
  onChangePeriod: (period: ChartPeriod) => void
  periods?: ChartPeriod[]
} & MarginProps &
  LayoutProps

const ChartPeriodSelector = ({
  period,
  onChangePeriod,
  periods = CHART_PERIOD_DEFAULT,
  ...styleProps
}: ChartPeriodSelectorProps) => {
  return (
    <ToggleButton
      {...styleProps}
      items={periods.map(period => ({ id: period, label: getPeriodStr(period) }))}
      selectedItemId={period}
      onChange={onChangePeriod}
    />
  )
}

export default ChartPeriodSelector

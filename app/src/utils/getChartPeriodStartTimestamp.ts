import { ChartPeriod } from '@/app/constants/chart'

import {
  SECONDS_IN_DAY,
  SECONDS_IN_MONTH,
  SECONDS_IN_SIX_MONTHS,
  SECONDS_IN_WEEK,
  SECONDS_IN_YEAR,
} from '../constants/time'

export default function getChartPeriodStartTimestamp(blockTimestamp: number, period: ChartPeriod): number {
  switch (period) {
    case ChartPeriod.OneDay:
      return blockTimestamp - SECONDS_IN_DAY
    case ChartPeriod.ThreeDays:
      return blockTimestamp - SECONDS_IN_DAY * 3
    case ChartPeriod.OneWeek:
      return blockTimestamp - SECONDS_IN_WEEK
    case ChartPeriod.TwoWeeks:
      return blockTimestamp - SECONDS_IN_WEEK * 2
    case ChartPeriod.OneMonth:
      return blockTimestamp - SECONDS_IN_MONTH
    case ChartPeriod.ThreeMonths:
      return blockTimestamp - SECONDS_IN_MONTH * 3
    case ChartPeriod.SixMonths:
      return blockTimestamp - SECONDS_IN_SIX_MONTHS
    case ChartPeriod.OneYear:
      return blockTimestamp - SECONDS_IN_YEAR
    case ChartPeriod.AllTime:
      return 0
  }
}

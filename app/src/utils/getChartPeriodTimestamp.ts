import { ChartPeriod } from '@/app/constants/chart'

import {
  SECONDS_IN_DAY,
  SECONDS_IN_MONTH,
  SECONDS_IN_SIX_MONTHS,
  SECONDS_IN_WEEK,
  SECONDS_IN_YEAR,
} from '../constants/time'

export default function getChartPeriodTimestamp(period: ChartPeriod): number {
  switch (period) {
    case ChartPeriod.OneDay:
      return SECONDS_IN_DAY
    case ChartPeriod.ThreeDays:
      return SECONDS_IN_DAY * 3
    case ChartPeriod.OneWeek:
      return SECONDS_IN_WEEK
    case ChartPeriod.TwoWeeks:
      return SECONDS_IN_WEEK * 2
    case ChartPeriod.OneMonth:
      return SECONDS_IN_MONTH
    case ChartPeriod.ThreeMonths:
      return SECONDS_IN_MONTH * 3
    case ChartPeriod.SixMonths:
      return SECONDS_IN_SIX_MONTHS
    case ChartPeriod.OneYear:
      return SECONDS_IN_YEAR
    case ChartPeriod.AllTime:
      return Date.now() / 1000
  }
}

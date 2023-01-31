import { ChartInterval } from '@/app/constants/chart'

import {
  SECONDS_IN_DAY,
  SECONDS_IN_MONTH,
  SECONDS_IN_SIX_MONTHS,
  SECONDS_IN_WEEK,
  SECONDS_IN_YEAR,
} from '../constants/time'

export default function getChartIntervalSeconds(period: ChartInterval): number {
  switch (period) {
    case ChartInterval.OneDay:
      return SECONDS_IN_DAY
    case ChartInterval.ThreeDays:
      return SECONDS_IN_DAY * 3
    case ChartInterval.OneWeek:
      return SECONDS_IN_WEEK
    case ChartInterval.TwoWeeks:
      return SECONDS_IN_WEEK * 2
    case ChartInterval.OneMonth:
      return SECONDS_IN_MONTH
    case ChartInterval.ThreeMonths:
      return SECONDS_IN_MONTH * 3
    case ChartInterval.SixMonths:
      return SECONDS_IN_SIX_MONTHS
    case ChartInterval.OneYear:
      return SECONDS_IN_YEAR
    case ChartInterval.AllTime:
      return Date.now() / 1000
  }
}

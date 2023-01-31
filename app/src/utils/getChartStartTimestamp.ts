import { ChartInterval } from '@/app/constants/chart'

import {
  SECONDS_IN_DAY,
  SECONDS_IN_MONTH,
  SECONDS_IN_SIX_MONTHS,
  SECONDS_IN_WEEK,
  SECONDS_IN_YEAR,
} from '../constants/time'

export default function getChartStartTimestamp(blockTimestamp: number, period: ChartInterval): number {
  switch (period) {
    case ChartInterval.OneDay:
      return blockTimestamp - SECONDS_IN_DAY
    case ChartInterval.ThreeDays:
      return blockTimestamp - SECONDS_IN_DAY * 3
    case ChartInterval.OneWeek:
      return blockTimestamp - SECONDS_IN_WEEK
    case ChartInterval.TwoWeeks:
      return blockTimestamp - SECONDS_IN_WEEK * 2
    case ChartInterval.OneMonth:
      return blockTimestamp - SECONDS_IN_MONTH
    case ChartInterval.ThreeMonths:
      return blockTimestamp - SECONDS_IN_MONTH * 3
    case ChartInterval.SixMonths:
      return blockTimestamp - SECONDS_IN_SIX_MONTHS
    case ChartInterval.OneYear:
      return blockTimestamp - SECONDS_IN_YEAR
    case ChartInterval.AllTime:
      return 0
  }
}

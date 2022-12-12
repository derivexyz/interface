import { ChartPeriod } from '../constants/chart'

export default function getPeriodStr(period: ChartPeriod): string {
  switch (period) {
    case ChartPeriod.OneDay:
      return '1D'
    case ChartPeriod.ThreeDays:
      return '3D'
    case ChartPeriod.OneWeek:
      return '1W'
    case ChartPeriod.TwoWeeks:
      return '2W'
    case ChartPeriod.OneMonth:
      return '1M'
    case ChartPeriod.ThreeMonths:
      return '3M'
    case ChartPeriod.SixMonths:
      return '6M'
    case ChartPeriod.OneYear:
      return '1Y'
    case ChartPeriod.AllTime:
      return 'ALL'
  }
}

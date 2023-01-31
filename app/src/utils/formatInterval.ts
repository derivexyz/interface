import { ChartInterval } from '../constants/chart'

export default function formatInterval(interval: ChartInterval): string {
  switch (interval) {
    case ChartInterval.OneDay:
      return '1D'
    case ChartInterval.ThreeDays:
      return '3D'
    case ChartInterval.OneWeek:
      return '1W'
    case ChartInterval.TwoWeeks:
      return '2W'
    case ChartInterval.OneMonth:
      return '1M'
    case ChartInterval.ThreeMonths:
      return '3M'
    case ChartInterval.SixMonths:
      return '6M'
    case ChartInterval.OneYear:
      return '1Y'
    case ChartInterval.AllTime:
      return 'ALL'
  }
}

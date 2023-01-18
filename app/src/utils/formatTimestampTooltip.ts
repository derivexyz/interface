import formatDate from '@lyra/ui/utils/formatDate'
import formatDateTime from '@lyra/ui/utils/formatDateTime'

import { ChartPeriod } from '../constants/chart'

const formatTimestampTooltip = (timestamp: number, period: ChartPeriod): string => {
  switch (period) {
    case ChartPeriod.OneDay:
    case ChartPeriod.ThreeDays:
      return formatDateTime(timestamp, { hideMins: false, hideYear: true })
    case ChartPeriod.OneWeek:
    case ChartPeriod.TwoWeeks:
    case ChartPeriod.OneMonth:
      return formatDateTime(timestamp, { hideYear: true })
    case ChartPeriod.ThreeMonths:
    case ChartPeriod.SixMonths:
    case ChartPeriod.OneYear:
    case ChartPeriod.AllTime:
      return formatDate(timestamp)
  }
}

export default formatTimestampTooltip

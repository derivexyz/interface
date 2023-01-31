import formatDate from '@lyra/ui/utils/formatDate'
import formatDateTime from '@lyra/ui/utils/formatDateTime'

import { ChartInterval } from '../constants/chart'

const formatTimestampTooltip = (timestamp: number, interval: ChartInterval): string => {
  switch (interval) {
    case ChartInterval.OneDay:
    case ChartInterval.ThreeDays:
      return formatDateTime(timestamp, { hideMins: false, hideYear: true })
    case ChartInterval.OneWeek:
    case ChartInterval.TwoWeeks:
    case ChartInterval.OneMonth:
      return formatDateTime(timestamp, { hideYear: true })
    case ChartInterval.ThreeMonths:
    case ChartInterval.SixMonths:
    case ChartInterval.OneYear:
    case ChartInterval.AllTime:
      return formatDate(timestamp)
  }
}

export default formatTimestampTooltip

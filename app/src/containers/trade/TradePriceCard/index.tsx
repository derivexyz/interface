import Box from '@lyra/ui/components/Box'
import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { OhlcData } from '@lyra/ui/components/CandleChart'
import { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import { Market, SnapshotPeriod } from '@lyrafinance/lyra-js'
import React, { useCallback, useState } from 'react'

import ChartIntervalSelector from '@/app/components/common/ChartIntervalSelector'
import { ChartInterval } from '@/app/constants/chart'
import { TRADE_SPOT_CANDLE_CHART_HEIGHT, TRADE_SPOT_LINE_CHART_HEIGHT } from '@/app/constants/layout'
import useTraderSettings from '@/app/hooks/local_storage/useTraderSettings'

import SpotPriceCandleChart from '../../common/SpotPriceCandleChart'
import SpotPriceChartTitle from '../../common/SpotPriceChartTitle'
import SpotPriceLineChart from '../../common/SpotPriceLineChart'

type Props = {
  market: Market
}

const formatCandleDuration = (candlePeriod: SnapshotPeriod): string => {
  switch (candlePeriod) {
    case SnapshotPeriod.FifteenMinutes:
      return '15m'
    case SnapshotPeriod.OneHour:
      return '1h'
    case SnapshotPeriod.FourHours:
      return '4h'
    case SnapshotPeriod.EightHours:
      return '8h'
    case SnapshotPeriod.OneDay:
      return '1d'
    case SnapshotPeriod.SevenDays:
      return '7d'
  }
}

function getDefaultCandleDurationForPeriod(interval: ChartInterval): SnapshotPeriod {
  switch (interval) {
    case ChartInterval.OneDay:
    case ChartInterval.ThreeDays:
      return SnapshotPeriod.FifteenMinutes
    case ChartInterval.OneWeek:
    case ChartInterval.TwoWeeks:
      return SnapshotPeriod.FourHours
    case ChartInterval.OneMonth:
      return SnapshotPeriod.EightHours
    case ChartInterval.ThreeMonths:
    case ChartInterval.SixMonths:
      return SnapshotPeriod.OneDay
    case ChartInterval.OneYear:
    case ChartInterval.AllTime:
      return SnapshotPeriod.SevenDays
  }
}

const CANDLE_CHART_INTERVALS = [
  ChartInterval.OneDay,
  ChartInterval.OneWeek,
  ChartInterval.OneMonth,
  ChartInterval.ThreeMonths,
]

const candlePeriodValues: SnapshotPeriod[] = Object.values(SnapshotPeriod).flatMap(val =>
  typeof val === 'number' ? [val] : []
)

const TradePriceCard = ({ market }: Props): CardElement => {
  const [interval, setInterval] = useState(ChartInterval.OneDay)
  const [spotPrice, setSpotPrice] = useState<number | null>(null)
  const [candle, setCandle] = useState<OhlcData | null>(null)
  const [isSnapshotPeriodDropdownOpen, setIsSnapshotPeriodDropdownOpen] = useState(false)
  const [candleDuration, setCandleDuration] = useState<SnapshotPeriod>(getDefaultCandleDurationForPeriod(interval))
  const [traderSettings] = useTraderSettings()
  const { isAdvancedMode, advancedHideChart: _advancedHideChart } = traderSettings
  const advancedHideChart = isAdvancedMode && _advancedHideChart

  const handleCandleHover = useCallback((ohlcData: OhlcData | null) => {
    setCandle(ohlcData)
    setSpotPrice(ohlcData ? ohlcData.close : null)
  }, [])

  const handleLineHover = useCallback((spotPrice: number | null) => {
    setSpotPrice(spotPrice)
  }, [])

  const handleChangeChartInterval = useCallback((chartInterval: ChartInterval) => {
    setInterval(chartInterval)
    setCandleDuration(getDefaultCandleDurationForPeriod(chartInterval))
  }, [])

  return (
    <CardBody>
      <Flex width="100%" alignItems="flex-start">
        <Box flexGrow={1}>
          <SpotPriceChartTitle
            market={market}
            isCandleChart={isAdvancedMode}
            interval={interval}
            hoverSpotPrice={spotPrice}
            hoverCandle={candle}
          />
        </Box>
        {!advancedHideChart && isAdvancedMode ? (
          <DropdownButton
            mobileTitle="Select Candle"
            label={formatCandleDuration(candleDuration)}
            isOpen={isSnapshotPeriodDropdownOpen}
            onClick={() => setIsSnapshotPeriodDropdownOpen(!isSnapshotPeriodDropdownOpen)}
            onClose={() => setIsSnapshotPeriodDropdownOpen(false)}
          >
            {candlePeriodValues.map(candlePeriodVal => (
              <DropdownButtonListItem
                isSelected={candlePeriodVal === candleDuration}
                key={candlePeriodVal}
                label={formatCandleDuration(candlePeriodVal)}
                onClick={() => {
                  setCandleDuration(candlePeriodVal)
                  setIsSnapshotPeriodDropdownOpen(false)
                }}
              />
            ))}
          </DropdownButton>
        ) : null}
        {!advancedHideChart ? (
          <ChartIntervalSelector
            ml={3}
            intervals={CANDLE_CHART_INTERVALS}
            selectedInterval={interval}
            onChangeInterval={handleChangeChartInterval}
          />
        ) : null}
      </Flex>
      {!advancedHideChart ? (
        isAdvancedMode ? (
          <SpotPriceCandleChart
            market={market}
            interval={interval}
            candleDuration={candleDuration}
            onHover={handleCandleHover}
            height={TRADE_SPOT_CANDLE_CHART_HEIGHT}
          />
        ) : (
          <SpotPriceLineChart
            market={market}
            onHover={handleLineHover}
            hoverSpotPrice={spotPrice}
            height={TRADE_SPOT_LINE_CHART_HEIGHT}
            interval={interval}
          />
        )
      ) : null}
    </CardBody>
  )
}

export default TradePriceCard

import Box from '@lyra/ui/components/Box'
import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import IconButton from '@lyra/ui/components/Button/IconButton'
import { OhlcData } from '@lyra/ui/components/CandleChart'
import Card, { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
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
  const [traderSettings, setTraderSettings] = useTraderSettings()
  const isCandleChart = traderSettings.isCandleChart
  const isMobile = useIsMobile()

  const handleCandleHover = useCallback((ohlcData: OhlcData | null) => {
    setCandle(ohlcData)
    setSpotPrice(ohlcData ? ohlcData.close : null)
  }, [])

  const handleLineHover = useCallback((spotPrice: number | null) => {
    setSpotPrice(spotPrice)
  }, [])

  const handleToggleCandleChart = useCallback(
    () => setTraderSettings('isCandleChart', !isCandleChart),
    [isCandleChart, setTraderSettings]
  )

  const handleChangeChartInterval = useCallback((chartInterval: ChartInterval) => {
    setInterval(chartInterval)
    setCandleDuration(getDefaultCandleDurationForPeriod(chartInterval))
  }, [])

  return (
    <Card>
      {/* No top spacing on mobile */}
      <CardBody pt={isMobile ? 0 : 6}>
        <Flex width="100%" alignItems="flex-start" pb={2}>
          <Box flexGrow={1}>
            <SpotPriceChartTitle
              market={market}
              isCandleChart={isCandleChart}
              interval={interval}
              hoverSpotPrice={spotPrice}
              hoverCandle={candle}
            />
          </Box>
          {isCandleChart && !isMobile ? (
            <DropdownButton
              mr={2}
              textVariant="secondary"
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
          {!isMobile ? (
            <Flex>
              <ChartIntervalSelector
                intervals={CANDLE_CHART_INTERVALS}
                mr={2}
                ml="auto"
                selectedInterval={interval}
                onChangeInterval={handleChangeChartInterval}
              />
              <IconButton
                icon={
                  isCandleChart ? (
                    <Icon icon={IconType.Activity} size={16} />
                  ) : (
                    <Icon icon={IconType.Candle} size={24} />
                  )
                }
                onClick={handleToggleCandleChart}
              />
            </Flex>
          ) : null}
        </Flex>
        {isCandleChart ? (
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
        )}
        {isMobile ? (
          <Center mt={2}>
            <ChartIntervalSelector
              intervals={CANDLE_CHART_INTERVALS}
              selectedInterval={interval}
              onChangeInterval={handleChangeChartInterval}
            />
            <IconButton
              mr={2}
              icon={
                isCandleChart ? <Icon icon={IconType.Activity} size={16} /> : <Icon icon={IconType.Candle} size={24} />
              }
              onClick={handleToggleCandleChart}
            />
          </Center>
        ) : null}
      </CardBody>
    </Card>
  )
}

export default TradePriceCard

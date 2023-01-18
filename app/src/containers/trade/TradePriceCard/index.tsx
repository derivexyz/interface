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

import ChartPeriodSelector from '@/app/components/common/ChartPeriodSelector'
import { ChartPeriod } from '@/app/constants/chart'
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

function getDefaultCandleDurationForPeriod(period: ChartPeriod): SnapshotPeriod {
  switch (period) {
    case ChartPeriod.OneDay:
    case ChartPeriod.ThreeDays:
      return SnapshotPeriod.FifteenMinutes
    case ChartPeriod.OneWeek:
    case ChartPeriod.TwoWeeks:
      return SnapshotPeriod.FourHours
    case ChartPeriod.OneMonth:
      return SnapshotPeriod.EightHours
    case ChartPeriod.ThreeMonths:
    case ChartPeriod.SixMonths:
      return SnapshotPeriod.OneDay
    case ChartPeriod.OneYear:
    case ChartPeriod.AllTime:
      return SnapshotPeriod.SevenDays
  }
}

const CANDLE_CHART_PERIODS = [ChartPeriod.OneDay, ChartPeriod.OneWeek, ChartPeriod.OneMonth, ChartPeriod.ThreeMonths]

const candlePeriodValues: SnapshotPeriod[] = Object.values(SnapshotPeriod).flatMap(val =>
  typeof val === 'number' ? [val] : []
)

const TradePriceCard = ({ market }: Props): CardElement => {
  const [period, setPeriod] = useState(ChartPeriod.OneDay)
  const [spotPrice, setSpotPrice] = useState<number | null>(null)
  const [candle, setCandle] = useState<OhlcData | null>(null)
  const [isSnapshotPeriodDropdownOpen, setIsSnapshotPeriodDropdownOpen] = useState(false)
  const [candleDuration, setCandleDuration] = useState<SnapshotPeriod>(getDefaultCandleDurationForPeriod(period))
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

  const handleChangeChartPeriod = useCallback((chartPeriod: ChartPeriod) => {
    setPeriod(chartPeriod)
    setCandleDuration(getDefaultCandleDurationForPeriod(chartPeriod))
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
              period={period}
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
              <ChartPeriodSelector
                periods={CANDLE_CHART_PERIODS}
                mr={2}
                ml="auto"
                selectedPeriod={period}
                onChangePeriod={handleChangeChartPeriod}
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
            period={period}
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
            period={period}
          />
        )}
        {isMobile ? (
          <Center mt={2}>
            <ChartPeriodSelector
              periods={CANDLE_CHART_PERIODS}
              selectedPeriod={period}
              onChangePeriod={handleChangeChartPeriod}
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

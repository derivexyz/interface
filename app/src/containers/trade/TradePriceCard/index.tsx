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
import React, { useCallback, useState } from 'react'

import ChartPeriodSelector from '@/app/components/common/ChartPeriodSelector'
import { CandlePeriod, ChartPeriod } from '@/app/constants/chart'
import { TRADE_SPOT_CANDLE_CHART_HEIGHT, TRADE_SPOT_LINE_CHART_HEIGHT } from '@/app/constants/layout'
import useTraderSettings from '@/app/hooks/local_storage/useTraderSettings'

import SpotPriceCandleChart from '../../common/SpotPriceCandleChart'
import SpotPriceChartTitle from '../../common/SpotPriceChartTitle'
import SpotPriceLineChart from '../../common/SpotPriceLineChart'

type Props = {
  marketAddressOrName: string
}

const getCandlePeriodLabel = (candlePeriod: CandlePeriod): string => {
  switch (candlePeriod) {
    case CandlePeriod.FifteenMinutes:
      return '15m'
    case CandlePeriod.OneHour:
      return '1h'
    case CandlePeriod.FourHours:
      return '4h'
    case CandlePeriod.EightHours:
      return '8h'
    case CandlePeriod.OneDay:
      return '1d'
    case CandlePeriod.SevenDays:
      return '7d'
    default:
      return ''
  }
}

function getCandlePeriodForChartPeriod(period: ChartPeriod) {
  switch (period) {
    case ChartPeriod.OneDay:
    case ChartPeriod.ThreeDays:
      return 3600 // 1 hr
    case ChartPeriod.OneWeek:
    case ChartPeriod.TwoWeeks:
      return 14400 // 4 hr
    case ChartPeriod.OneMonth:
      return 86400 // 1d
    case ChartPeriod.ThreeMonths:
    case ChartPeriod.SixMonths:
    case ChartPeriod.OneYear:
    case ChartPeriod.AllTime:
      return 604800 // 7d
  }
}

const candlePeriodValues: CandlePeriod[] = Object.values(CandlePeriod).flatMap(val =>
  typeof val === 'number' ? [val] : []
)

const TradePriceCard = ({ marketAddressOrName }: Props): CardElement => {
  const [period, setPeriod] = useState(ChartPeriod.OneDay)
  const [spotPrice, setSpotPrice] = useState<number | null>(null)
  const [candle, setCandle] = useState<OhlcData | null>(null)
  const [isCandlePeriodDropdownOpen, setIsCandlePeriodDropdownOpen] = useState(false)
  const [candlePeriod, setCandlePeriod] = useState<CandlePeriod>(getCandlePeriodForChartPeriod(period))
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
    setCandlePeriod(getCandlePeriodForChartPeriod(chartPeriod))
  }, [])

  return (
    <Card>
      {/* No top spacing on mobile */}
      <CardBody pt={isMobile ? 0 : 6}>
        <Flex width="100%" alignItems="flex-start" pb={2}>
          <Box flexGrow={1}>
            <SpotPriceChartTitle
              isCandleChart={isCandleChart}
              marketAddressOrName={marketAddressOrName}
              period={period}
              hoverSpotPrice={spotPrice}
              hoverCandle={candle}
            />
          </Box>
          {isCandleChart && !isMobile ? (
            <DropdownButton
              mr={2}
              isTransparent
              width={70}
              textVariant="secondary"
              label={getCandlePeriodLabel(candlePeriod)}
              isOpen={isCandlePeriodDropdownOpen}
              onClick={() => setIsCandlePeriodDropdownOpen(!isCandlePeriodDropdownOpen)}
              onClose={() => setIsCandlePeriodDropdownOpen(false)}
            >
              {candlePeriodValues.map(candlePeriodVal => (
                <DropdownButtonListItem
                  isSelected={candlePeriodVal === candlePeriod}
                  key={candlePeriodVal}
                  label={getCandlePeriodLabel(candlePeriodVal)}
                  onClick={() => {
                    setCandlePeriod(candlePeriodVal)
                    setIsCandlePeriodDropdownOpen(false)
                  }}
                />
              ))}
            </DropdownButton>
          ) : null}

          {!isMobile ? (
            <Flex>
              <ChartPeriodSelector mr={2} ml="auto" selectedPeriod={period} onChangePeriod={handleChangeChartPeriod} />
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
            marketAddressOrName={marketAddressOrName}
            period={period}
            candlePeriod={candlePeriod}
            onHover={handleCandleHover}
            height={TRADE_SPOT_CANDLE_CHART_HEIGHT}
          />
        ) : (
          <SpotPriceLineChart
            onHover={handleLineHover}
            hoverSpotPrice={spotPrice}
            height={TRADE_SPOT_LINE_CHART_HEIGHT}
            marketAddressOrName={marketAddressOrName}
            period={period}
          />
        )}

        {isMobile ? (
          <Center mt={2}>
            <IconButton
              mr={2}
              icon={
                isCandleChart ? <Icon icon={IconType.Activity} size={16} /> : <Icon icon={IconType.Candle} size={24} />
              }
              onClick={handleToggleCandleChart}
            />
            <ChartPeriodSelector selectedPeriod={period} onChangePeriod={handleChangeChartPeriod} />
          </Center>
        ) : null}
      </CardBody>
    </Card>
  )
}

export default TradePriceCard

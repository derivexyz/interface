import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Flex from '@lyra/ui/components/Flex'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { Market } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo, useState } from 'react'

import ChartIntervalSelector from '@/app/components/common/ChartIntervalSelector'
import { ChartInterval, VaultChart } from '@/app/constants/chart'

import VaultsChartNetDelta from './VaultsChartNetDelta'
import VaultsChartOverviewSection from './VaultsChartOverviewSection'
import VaultsChartPerf from './VaultsChartPerf'
import VaultsChartTVL from './VaultsChartTVL'
import VaultsChartVolume from './VaultsChartVolume'

type Props = {
  market: Market
}

export const VAULTS_CHARTS: { id: VaultChart; label: string }[] = [
  {
    id: VaultChart.TVL,
    label: 'TVL',
  },
  {
    id: VaultChart.Volume,
    label: 'Volume',
  },
  {
    id: VaultChart.Performance,
    label: 'Performance',
  },
  {
    id: VaultChart.NetDelta,
    label: 'Net Delta',
  },
]

const TVL_CHARTS_INTERVALS = [
  ChartInterval.OneMonth,
  ChartInterval.ThreeMonths,
  ChartInterval.SixMonths,
  ChartInterval.AllTime,
]

const VOLUME_CHARTS_INTERVALS = [
  ChartInterval.OneMonth,
  ChartInterval.ThreeMonths,
  ChartInterval.SixMonths,
  ChartInterval.AllTime,
]

const PERF_CHARTS_INTERVALS = [
  ChartInterval.OneMonth,
  ChartInterval.ThreeMonths,
  ChartInterval.SixMonths,
  ChartInterval.OneYear,
]

const NET_DELTA_CHART_INTERVALS = [
  ChartInterval.ThreeDays,
  ChartInterval.OneWeek,
  ChartInterval.TwoWeeks,
  ChartInterval.OneMonth,
]

const getIntervalsForChart = (chart: VaultChart): ChartInterval[] => {
  switch (chart) {
    case VaultChart.TVL:
      return TVL_CHARTS_INTERVALS
    case VaultChart.Volume:
      return VOLUME_CHARTS_INTERVALS
    case VaultChart.Performance:
      return PERF_CHARTS_INTERVALS
    case VaultChart.NetDelta:
      return NET_DELTA_CHART_INTERVALS
  }
}

const VaultsChartCard = ({ market }: Props) => {
  const [chart, setChart] = useState(VaultChart.TVL)
  const selectedChart = useMemo(() => VAULTS_CHARTS.find(c => c.id === chart), [chart])
  const [interval, setInterval] = useState(getIntervalsForChart(chart)[0])
  const [isOpen, setIsOpen] = useState(false)

  const handleChangeChart = useCallback((chart: VaultChart) => {
    setChart(chart)
    setInterval(getIntervalsForChart(chart)[0])
  }, [])

  const onClose = useCallback(() => setIsOpen(false), [])

  const isMobile = useIsMobile()

  return (
    <Card flexDirection={['column', 'row']}>
      <VaultsChartOverviewSection market={market} />
      <CardSeparator isVertical={!isMobile} />
      <CardSection flexGrow={[0, 1]} sx={{ position: 'relative' }}>
        <Flex sx={!isMobile ? { position: 'absolute', right: 6, top: 6 } : null}>
          <DropdownButton
            mr={[0, 2]}
            mb={[3, 0]}
            onClose={onClose}
            onClick={() => {
              setIsOpen(true)
            }}
            isOpen={isOpen}
            label={selectedChart?.label ?? ''}
          >
            {VAULTS_CHARTS.map(chart => {
              return (
                <DropdownButtonListItem
                  key={chart.id}
                  isSelected={chart.id === selectedChart?.id}
                  label={chart.label}
                  onClick={() => {
                    handleChangeChart(chart.id)
                    onClose()
                  }}
                />
              )
            })}
          </DropdownButton>
          <ChartIntervalSelector
            ml={['auto', null]}
            intervals={getIntervalsForChart(chart)}
            selectedInterval={interval}
            onChangeInterval={setInterval}
          />
        </Flex>
        {chart === VaultChart.TVL ? (
          <VaultsChartTVL market={market} interval={interval} />
        ) : chart === VaultChart.Volume ? (
          <VaultsChartVolume market={market} interval={interval} />
        ) : chart === VaultChart.Performance ? (
          <VaultsChartPerf market={market} interval={interval} />
        ) : chart === VaultChart.NetDelta ? (
          <VaultsChartNetDelta market={market} interval={interval} />
        ) : null}
      </CardSection>
    </Card>
  )
}

export default VaultsChartCard

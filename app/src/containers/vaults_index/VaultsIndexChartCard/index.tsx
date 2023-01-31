import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Flex from '@lyra/ui/components/Flex'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React, { useCallback, useState } from 'react'

import ChartIntervalSelector from '@/app/components/common/ChartIntervalSelector'
import { ChartInterval, VaultIndexChart } from '@/app/constants/chart'

import VaultsIndexChartOverviewSection from './VaultsIndexChartOverviewSection'
import VaultsIndexChartTVL from './VaultsIndexChartTVL'
import VaultsIndexChartVolume from './VaultsIndexChartVolume'

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

const getIntervalsForChart = (chart: VaultIndexChart): ChartInterval[] => {
  switch (chart) {
    case VaultIndexChart.TVL:
      return TVL_CHARTS_INTERVALS
    case VaultIndexChart.Volume:
      return VOLUME_CHARTS_INTERVALS
  }
}

export const VAULTS_INDEX_CHARTS: { id: VaultIndexChart; label: string }[] = [
  {
    id: VaultIndexChart.TVL,
    label: 'TVL',
  },
  {
    id: VaultIndexChart.Volume,
    label: 'Volume',
  },
]

const VaultsIndexChartCard = () => {
  const [chart, setChart] = useState(VaultIndexChart.TVL)
  const [interval, setInterval] = useState(getIntervalsForChart(chart)[0])
  const handleChangeChart = useCallback((chart: VaultIndexChart) => {
    setChart(chart)
    setInterval(getIntervalsForChart(chart)[0])
  }, [])
  const selectedChart = VAULTS_INDEX_CHARTS.find(c => c.id === chart)
  const [isOpen, setIsOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])
  const isMobile = useIsMobile()

  return (
    <Card flexDirection={['column', 'row']}>
      <VaultsIndexChartOverviewSection />
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
            {VAULTS_INDEX_CHARTS.map(chart => {
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
        {chart === VaultIndexChart.TVL ? (
          <VaultsIndexChartTVL interval={interval} />
        ) : chart === VaultIndexChart.Volume ? (
          <VaultsIndexChartVolume interval={interval} />
        ) : null}
      </CardSection>
    </Card>
  )
}

export default VaultsIndexChartCard

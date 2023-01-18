import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Flex from '@lyra/ui/components/Flex'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React, { useCallback, useState } from 'react'

import ChartPeriodSelector from '@/app/components/common/ChartPeriodSelector'
import { ChartPeriod, VaultIndexChart } from '@/app/constants/chart'

import VaultsIndexChartOverviewSection from './VaultsIndexChartOverviewSection'
import VaultsIndexChartTVL from './VaultsIndexChartTVL'
import VaultsIndexChartVolume from './VaultsIndexChartVolume'

const TVL_CHARTS_PERIODS = [ChartPeriod.OneMonth, ChartPeriod.ThreeMonths, ChartPeriod.SixMonths, ChartPeriod.AllTime]

const VOLUME_CHARTS_PERIODS = [
  ChartPeriod.OneMonth,
  ChartPeriod.ThreeMonths,
  ChartPeriod.SixMonths,
  ChartPeriod.AllTime,
]

const getPeriodsForChart = (chart: VaultIndexChart): ChartPeriod[] => {
  switch (chart) {
    case VaultIndexChart.TVL:
      return TVL_CHARTS_PERIODS
    case VaultIndexChart.Volume:
      return VOLUME_CHARTS_PERIODS
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
  const [period, setPeriod] = useState(getPeriodsForChart(chart)[0])
  const handleChangeChart = useCallback((chart: VaultIndexChart) => {
    setChart(chart)
    setPeriod(getPeriodsForChart(chart)[0])
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
          <ChartPeriodSelector
            ml={['auto', null]}
            periods={getPeriodsForChart(chart)}
            selectedPeriod={period}
            onChangePeriod={setPeriod}
          />
        </Flex>
        {chart === VaultIndexChart.TVL ? (
          <VaultsIndexChartTVL period={period} />
        ) : chart === VaultIndexChart.Volume ? (
          <VaultsIndexChartVolume period={period} />
        ) : null}
      </CardSection>
    </Card>
  )
}

export default VaultsIndexChartCard

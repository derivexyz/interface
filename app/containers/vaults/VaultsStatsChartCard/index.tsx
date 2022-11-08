import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Center from '@lyra/ui/components/Center'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import React, { useState } from 'react'

import ChartPeriodSelector from '@/app/components/common/ChartPeriodSelector'
import VaultsChartSelector, { VaultChart, VAULTS_CHARTS } from '@/app/components/vaults/VaultsChartSelector'
import { ChartPeriod } from '@/app/constants/chart'
import { VAULTS_CHART_HEIGHT } from '@/app/constants/layout'
import { LogEvent } from '@/app/constants/logEvents'
import useQueryParam from '@/app/hooks/url/useQueryParam'
import { FeesSnapshot } from '@/app/hooks/vaults/useVaultFeesHistory'
import { NetGreeksSnapshot } from '@/app/hooks/vaults/useVaultNetGreeksHistory'
import { PNLSnapshot } from '@/app/hooks/vaults/useVaultPNLHistory'
import { TVLSnapshot } from '@/app/hooks/vaults/useVaultTVLHistory'
import coerce from '@/app/utils/coerce'
import logEvent from '@/app/utils/logEvent'

import VaultsDepositAndWithdrawModal from '../VaultsDepositAndWithdrawModal'
import VaultsStatsChartCardFeesBreakdown from './VaultsStatsChartCardFeesBreakdown'
import VaultsStatsChartCardFeesChart from './VaultsStatsChartCardFeesChart'
import VaultsStatsChartCardNetDeltaBreakdown from './VaultsStatsChartCardNetDeltaBreakdown'
import VaultsStatsChartCardNetDeltaChart from './VaultsStatsChartCardNetDeltaChart'
import VaultsStatsChartCardPNLBreakdown from './VaultsStatsChartCardPNLBreakdown'
import VaultsStatsChartCardPNLChart from './VaultsStatsChartCardPNLChart'
import VaultsStatsChartCardTVLBreakdown from './VaultsStatsChartCardTVLBreakdown'
import VaultsStatsChartCardTVLChart from './VaultsStatsChartCardTVLChart'

const DEFAULT_CHARTS_PERIOD_OPTIONS = [
  ChartPeriod.OneMonth,
  ChartPeriod.ThreeMonths,
  ChartPeriod.SixMonths,
  ChartPeriod.OneYear,
]

type Props = {
  marketAddressOrName: string
} & MarginProps

const VaultsStatsChartCard = ({ marketAddressOrName, ...marginProps }: Props) => {
  const [period, setPeriod] = useState(ChartPeriod.OneMonth)

  const [_selectedChart, setSelectedChart] = useQueryParam('chart')
  const selectedChart = coerce(VaultChart, _selectedChart) ?? VaultChart.TVL
  const [tvlHoverData, setTvlHoverData] = useState<TVLSnapshot | null>(null)
  const [pnlHoverData, setPnlHoverData] = useState<PNLSnapshot | null>(null)
  const [netDeltaHoverData, setNetDeltaHoverData] = useState<NetGreeksSnapshot | null>(null)
  const [feesHoverData, setFeesHoverData] = useState<FeesSnapshot | null>(null)
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [isDeposit, setIsDeposit] = useState(true)
  const selectedChartId = VAULTS_CHARTS.find(chart => chart.id === selectedChart)?.id as unknown as VaultChart // Always defined

  const breakdownComponent =
    selectedChartId === VaultChart.TVL ? (
      <VaultsStatsChartCardTVLBreakdown
        marketAddressOrName={marketAddressOrName}
        hoverData={tvlHoverData}
        period={period}
      />
    ) : selectedChartId === VaultChart.PNL ? (
      <VaultsStatsChartCardPNLBreakdown
        marketAddressOrName={marketAddressOrName}
        hoverData={pnlHoverData}
        period={period}
      />
    ) : selectedChartId === VaultChart.Fees ? (
      <VaultsStatsChartCardFeesBreakdown
        marketAddressOrName={marketAddressOrName}
        hoverData={feesHoverData}
        period={period}
      />
    ) : (
      <VaultsStatsChartCardNetDeltaBreakdown
        marketAddressOrName={marketAddressOrName}
        hoverData={netDeltaHoverData}
        period={period}
      />
    )

  const chartComponent =
    selectedChartId === VaultChart.TVL ? (
      <VaultsStatsChartCardTVLChart
        height={VAULTS_CHART_HEIGHT}
        marketAddressOrName={marketAddressOrName}
        period={period}
        hoverData={tvlHoverData}
        onHover={setTvlHoverData}
      />
    ) : selectedChartId === VaultChart.PNL ? (
      <VaultsStatsChartCardPNLChart
        height={VAULTS_CHART_HEIGHT}
        marketAddressOrName={marketAddressOrName}
        period={period}
        hoverData={pnlHoverData}
        onHover={setPnlHoverData}
      />
    ) : selectedChartId === VaultChart.Fees ? (
      <VaultsStatsChartCardFeesChart
        height={VAULTS_CHART_HEIGHT}
        marketAddressOrName={marketAddressOrName}
        period={period}
        onHover={setFeesHoverData}
      />
    ) : (
      <VaultsStatsChartCardNetDeltaChart
        height={VAULTS_CHART_HEIGHT}
        marketAddressOrName={marketAddressOrName}
        period={period}
        hoverData={netDeltaHoverData}
        onHover={setNetDeltaHoverData}
      />
    )

  if (isMobile) {
    return (
      <Card {...marginProps}>
        <CardBody height="100%">
          <VaultsChartSelector
            selectedChart={selectedChart}
            onChangeChart={chart => {
              setSelectedChart(chart)
              logEvent(LogEvent.VaultChartTypeSelect, { chart })
            }}
            mx={-3}
          />
          {breakdownComponent}
          {chartComponent}
          <Center mt={2} mb={4}>
            <ChartPeriodSelector
              selectedPeriod={period}
              onChangePeriod={period => {
                setPeriod(period)
                logEvent(LogEvent.VaultChartPeriodSelect, { chart: selectedChartId, period })
              }}
              periods={DEFAULT_CHARTS_PERIOD_OPTIONS}
            />
          </Center>
          {/* TODO: Move to mobile footer button */}
          <Button
            onClick={() => setIsOpen(true)}
            label={isDeposit ? 'Deposit' : 'Withdraw'}
            size="lg"
            variant="primary"
            width="100%"
          />
          <VaultsDepositAndWithdrawModal
            isDeposit={isDeposit}
            onToggleDeposit={setIsDeposit}
            onClose={() => setIsOpen(false)}
            isOpen={isOpen}
            marketAddressOrName={marketAddressOrName}
          />
        </CardBody>
      </Card>
    )
  } else {
    return (
      <Card flexDirection="row" {...marginProps}>
        <CardSection width={200} isHorizontal>
          <VaultsChartSelector
            selectedChart={selectedChart}
            onChangeChart={chart => {
              setSelectedChart(chart)
              logEvent(LogEvent.VaultChartTypeSelect, { chart, period })
            }}
            mx={-3}
          />
          {breakdownComponent}
        </CardSection>
        <CardSeparator isVertical />
        <CardSection flexGrow={1} isHorizontal>
          <ChartPeriodSelector
            ml="auto"
            mb={2}
            selectedPeriod={period}
            onChangePeriod={period => {
              setPeriod(period)
              logEvent(LogEvent.VaultChartPeriodSelect, { chart: selectedChartId, period })
            }}
            periods={DEFAULT_CHARTS_PERIOD_OPTIONS}
          />
          {chartComponent}
        </CardSection>
      </Card>
    )
  }
}

export default VaultsStatsChartCard

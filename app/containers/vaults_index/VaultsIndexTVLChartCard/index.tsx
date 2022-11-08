import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import React, { useState } from 'react'

import ChartPeriodSelector from '@/app/components/common/ChartPeriodSelector'
import { ChartPeriod } from '@/app/constants/chart'
import { VaultsTVLSnapshot } from '@/app/hooks/vaults/useVaultsTVLHistory'

import VaultsIndexTVLChartCardChart from './VaultsIndexTVLChartCardChart'
import VaultsIndexTVLChartCardTitle from './VaultsIndexTVLChartCardTitle'

const DEFAULT_CHARTS_PERIOD_OPTIONS = [
  ChartPeriod.OneMonth,
  ChartPeriod.ThreeMonths,
  ChartPeriod.SixMonths,
  ChartPeriod.OneYear,
]

const VaultsIndexTVLChartCard = ({ ...marginProps }: MarginProps) => {
  const [period, setPeriod] = useState(ChartPeriod.OneMonth)
  const [hoverData, setHoverData] = useState<VaultsTVLSnapshot | null>(null)
  const isMobile = useIsMobile()
  return (
    <Card {...marginProps}>
      <CardBody height="100%">
        <Flex>
          <VaultsIndexTVLChartCardTitle period={period} hoverData={hoverData} />
          {!isMobile ? (
            <ChartPeriodSelector
              ml="auto"
              width={['100%', 'auto']}
              selectedPeriod={period}
              onChangePeriod={setPeriod}
              periods={DEFAULT_CHARTS_PERIOD_OPTIONS}
            />
          ) : null}
        </Flex>
        <VaultsIndexTVLChartCardChart mt={1} period={period} onHover={setHoverData} hoverData={hoverData} />
        {isMobile ? (
          <Center mt={4}>
            <ChartPeriodSelector
              selectedPeriod={period}
              onChangePeriod={setPeriod}
              periods={DEFAULT_CHARTS_PERIOD_OPTIONS}
            />
          </Center>
        ) : null}
      </CardBody>
    </Card>
  )
}

export default VaultsIndexTVLChartCard

import Box from '@lyra/ui/components/Box'
import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import Shimmer from '@lyra/ui/components/Shimmer'
import { LayoutProps, MarginProps } from '@lyra/ui/types'
import React, { useCallback, useState } from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'

export enum VaultChart {
  TVL = 'tvl',
  PNL = 'pnl',
  Fees = 'fees',
  NetDelta = 'netdelta',
}

export const VAULTS_CHARTS: { id: VaultChart; label: string }[] = [
  {
    id: VaultChart.TVL,
    label: 'TVL',
  },
  {
    id: VaultChart.PNL,
    label: 'Performance',
  },
  {
    id: VaultChart.Fees,
    label: 'Fees',
  },
  {
    id: VaultChart.NetDelta,
    label: 'Net Delta',
  },
]

type Props = {
  selectedChart: VaultChart
  onChangeChart: (id: VaultChart) => void
} & LayoutProps &
  MarginProps

const VaultsChartSelector = withSuspense(
  ({ onChangeChart, selectedChart, ...styleProps }: Props) => {
    const chart = VAULTS_CHARTS.find(chart => chart.id === selectedChart)
    const [isOpen, setIsOpen] = useState(false)
    const onClose = useCallback(() => setIsOpen(false), [])
    return (
      <DropdownButton
        {...styleProps}
        isTransparent
        onClose={onClose}
        onClick={() => {
          setIsOpen(true)
        }}
        isOpen={isOpen}
        label={chart?.label ?? ''}
        size="md"
        textVariant="heading"
      >
        {VAULTS_CHARTS.map(chart => {
          return (
            <DropdownButtonListItem
              key={chart.id}
              isSelected={chart?.id === selectedChart}
              label={chart.label}
              onClick={() => {
                onChangeChart(chart.id)
                onClose()
              }}
            />
          )
        })}
      </DropdownButton>
    )
  },
  ({ onChangeChart, selectedChart, ...styleProps }: Props) => (
    <Box {...styleProps}>
      <Shimmer />
    </Box>
  )
)

export default VaultsChartSelector

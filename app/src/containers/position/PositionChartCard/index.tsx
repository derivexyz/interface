import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { ToggleButtonItemProps } from '@lyra/ui/components/Button/ToggleButtonItem'
import Card, { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { Option } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo, useState } from 'react'

import ChartPeriodSelector from '@/app/components/common/ChartPeriodSelector'
import { ChartPeriod } from '@/app/constants/chart'

import SpotPriceChartTitle from '../../common/SpotPriceChartTitle'
import SpotPriceLineChart from '../../common/SpotPriceLineChart'
import PositionIVChart from './PositionIVChart'
import PositionIVChartTitle from './PositionIVChartTitle'
import PositionPriceChart from './PositionPriceChart'
import PositionPriceChartTitle from './PositionPriceChartTitle'

type Props = {
  option: Option
}

enum PositionChart {
  OptionPrice = 'OptionPrice',
  ImpliedVolatility = 'ImpliedVolatility',
  SpotPrice = 'SpotPrice',
}

const CHARTS: Pick<ToggleButtonItemProps<PositionChart>, 'id' | 'label'>[] = [
  {
    id: PositionChart.OptionPrice,
    label: 'Option Price',
  },
  {
    id: PositionChart.ImpliedVolatility,
    label: 'Implied Volatility',
  },
  {
    id: PositionChart.SpotPrice,
    label: 'Spot Price',
  },
]

const CHART_PERIODS = [ChartPeriod.OneWeek, ChartPeriod.TwoWeeks, ChartPeriod.OneMonth, ChartPeriod.AllTime]

const PositionChartCard = ({ option }: Props): CardElement => {
  const [period, setPeriod] = useState(CHART_PERIODS[0])
  const [hoverOptionPrice, setHoverOptionPrice] = useState<number | null>(null)
  const [hoverImpliedVolatility, setHoverImpliedVolatility] = useState<number | null>(null)
  const [hoverSpotPrice, setHoverSpotPrice] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])
  const [chart, setChart] = useState(PositionChart.OptionPrice)
  const chartName = useMemo(() => CHARTS.find(c => c.id === chart), [chart])?.label ?? ''
  const isMobile = useIsMobile()

  const chartTitleComponent =
    chart === PositionChart.OptionPrice ? (
      <PositionPriceChartTitle option={option} period={period} hoverOptionPrice={hoverOptionPrice} />
    ) : chart === PositionChart.ImpliedVolatility ? (
      <PositionIVChartTitle strike={option.strike()} period={period} hoverImpliedVolatility={hoverImpliedVolatility} />
    ) : chart === PositionChart.SpotPrice ? (
      <SpotPriceChartTitle
        textVariant="heading"
        market={option.market()}
        period={period}
        hoverSpotPrice={hoverSpotPrice}
      />
    ) : null

  const chartComponent =
    chart === PositionChart.OptionPrice ? (
      <PositionPriceChart
        option={option}
        height={[120, 170]}
        period={period}
        hoverOptionPrice={hoverOptionPrice}
        onHover={setHoverOptionPrice}
      />
    ) : chart === PositionChart.ImpliedVolatility ? (
      <PositionIVChart
        strike={option.strike()}
        height={[120, 170]}
        period={period}
        hoverImpliedVolatility={hoverImpliedVolatility}
        onHover={setHoverImpliedVolatility}
      />
    ) : chart === PositionChart.SpotPrice ? (
      <SpotPriceLineChart
        market={option.market()}
        height={[120, 170]}
        period={period}
        hoverSpotPrice={hoverSpotPrice}
        onHover={setHoverSpotPrice}
      />
    ) : null

  return (
    <Card>
      <CardBody>
        <Flex>
          {chartTitleComponent}
          <Flex ml="auto" alignItems="flex-start">
            <DropdownButton mr={2} label={chartName} isOpen={isOpen} onClose={onClose} onClick={() => setIsOpen(true)}>
              {CHARTS.map(({ id, label }) => (
                <DropdownButtonListItem
                  key={id}
                  isSelected={id === chart}
                  label={label}
                  onClick={() => {
                    setChart(id)
                    onClose()
                  }}
                />
              ))}
            </DropdownButton>
            <ChartPeriodSelector periods={CHART_PERIODS} selectedPeriod={period} onChangePeriod={setPeriod} />
          </Flex>
        </Flex>
        {chartComponent}
      </CardBody>
    </Card>
  )
}

export default PositionChartCard

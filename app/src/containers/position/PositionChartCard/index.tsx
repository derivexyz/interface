import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import { ToggleButtonItemProps } from '@lyra/ui/components/Button/ToggleButtonItem'
import Card, { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import { Option } from '@lyrafinance/lyra-js'
import React, { useCallback, useMemo, useState } from 'react'

import ChartIntervalSelector from '@/app/components/common/ChartIntervalSelector'
import { ChartInterval } from '@/app/constants/chart'

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

const CHART_INTERVALS = [ChartInterval.OneWeek, ChartInterval.TwoWeeks, ChartInterval.OneMonth, ChartInterval.AllTime]

const PositionChartCard = ({ option }: Props): CardElement => {
  const [interval, setInterval] = useState(CHART_INTERVALS[0])
  const [hoverOptionPrice, setHoverOptionPrice] = useState<number | null>(null)
  const [hoverImpliedVolatility, setHoverImpliedVolatility] = useState<number | null>(null)
  const [hoverSpotPrice, setHoverSpotPrice] = useState<number | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const onClose = useCallback(() => setIsOpen(false), [])
  const [chart, setChart] = useState(PositionChart.OptionPrice)
  const chartName = useMemo(() => CHARTS.find(c => c.id === chart), [chart])?.label ?? ''

  const chartTitleComponent =
    chart === PositionChart.OptionPrice ? (
      <PositionPriceChartTitle option={option} interval={interval} hoverOptionPrice={hoverOptionPrice} />
    ) : chart === PositionChart.ImpliedVolatility ? (
      <PositionIVChartTitle
        strike={option.strike()}
        interval={interval}
        hoverImpliedVolatility={hoverImpliedVolatility}
      />
    ) : chart === PositionChart.SpotPrice ? (
      <SpotPriceChartTitle
        textVariant="heading"
        market={option.market()}
        interval={interval}
        hoverSpotPrice={hoverSpotPrice}
      />
    ) : null

  const chartComponent =
    chart === PositionChart.OptionPrice ? (
      <PositionPriceChart
        option={option}
        height={[120, 170]}
        interval={interval}
        hoverOptionPrice={hoverOptionPrice}
        onHover={setHoverOptionPrice}
      />
    ) : chart === PositionChart.ImpliedVolatility ? (
      <PositionIVChart
        strike={option.strike()}
        height={[120, 170]}
        interval={interval}
        hoverImpliedVolatility={hoverImpliedVolatility}
        onHover={setHoverImpliedVolatility}
      />
    ) : chart === PositionChart.SpotPrice ? (
      <SpotPriceLineChart
        market={option.market()}
        height={[120, 170]}
        interval={interval}
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
            <ChartIntervalSelector
              intervals={CHART_INTERVALS}
              selectedInterval={interval}
              onChangeInterval={setInterval}
            />
          </Flex>
        </Flex>
        {chartComponent}
      </CardBody>
    </Card>
  )
}

export default PositionChartCard

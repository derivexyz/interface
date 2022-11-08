import AreaChart from '@lyra/ui/components/AreaChart'
import BarChart from '@lyra/ui/components/BarChart'
import Box from '@lyra/ui/components/Box'
import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import ToggleButtonItem from '@lyra/ui/components/Button/ToggleButtonItem'
import CardSection from '@lyra/ui/components/Card/CardSection'
import LineChart from '@lyra/ui/components/LineChart'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import React, { useMemo, useState } from 'react'
import { Card } from 'rebass'

export default function ChartDemoCard({ ...marginProps }: MarginProps): JSX.Element {
  const chartData = useMemo(() => Array.from(Array(30).keys()), [])
  const [isAreaStacked, setIsAreaStacked] = useState(false)
  const [isBarStacked, setIsBarStacked] = useState(false)
  const lineChartData = useMemo(
    () => chartData.map(x => ({ x, data: Math.round(Math.random() * 100) / 100 })),
    [chartData]
  )
  const areaChartData = useMemo(
    () =>
      chartData.map(x => ({
        x,
        data: Math.round(Math.random() * 100),
        moreData: Math.random() * 100,
      })),
    [chartData]
  )
  return (
    <Box {...marginProps}>
      <Card overflow="hidden">
        <CardSection>
          <Text variant="heading">Line Chart</Text>
          <Box>
            <LineChart
              height={300}
              type="linear"
              data={lineChartData}
              dataKeys={[{ key: 'data', label: 'Custom Data' }]}
              renderTooltip={({ x, data }) => `${x}: ${data}`}
            />
          </Box>
        </CardSection>
        <CardSection>
          <Text variant="heading">Area Chart</Text>
          <ToggleButton>
            <ToggleButtonItem
              id="stacked"
              label="Stack"
              isSelected={isAreaStacked}
              onSelect={() => setIsAreaStacked(!isAreaStacked)}
            />
            <ToggleButtonItem
              id="unstacked"
              label="Unstack"
              isSelected={!isAreaStacked}
              onSelect={() => setIsAreaStacked(!isAreaStacked)}
            />
          </ToggleButton>
          <Box>
            <AreaChart
              height={300}
              type="linear"
              data={areaChartData}
              dataKeys={[
                {
                  key: 'data',
                  label: 'Custom Data',
                  stackId: 'a',
                },
                {
                  key: 'moreData',
                  label: 'More Custom Data',
                  stackId: isAreaStacked ? 'a' : 'b',
                },
              ]}
              renderTooltip={({ x, data, moreData }) => `${x}: ${data + moreData}`}
            />
          </Box>
        </CardSection>
        <CardSection>
          <Text variant="heading">Bar Chart</Text>
          <ToggleButton>
            <ToggleButtonItem
              id="stacked"
              label="Stack"
              isSelected={isBarStacked}
              onSelect={() => setIsBarStacked(!isAreaStacked)}
            />
            <ToggleButtonItem
              id="unstacked"
              label="Unstack"
              isSelected={!isBarStacked}
              onSelect={() => setIsBarStacked(!isAreaStacked)}
            />
          </ToggleButton>
          <Box>
            <BarChart
              height={300}
              data={areaChartData}
              dataKeys={[
                { key: 'data', label: 'Custom Data', stackId: 'a' },
                { key: 'moreData', label: 'More Data', stackId: isBarStacked ? 'a' : 'b' },
              ]}
              renderTooltip={({ data, moreData }) => `${data + moreData}`}
            />
          </Box>
        </CardSection>
      </Card>
    </Box>
  )
}

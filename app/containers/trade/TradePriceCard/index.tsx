import Card, { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React, { useState } from 'react'

import ChartPeriodSelector from '@/app/components/common/ChartPeriodSelector'
import { ChartPeriod } from '@/app/constants/chart'

import SpotPriceChart from '../../common/SpotPriceChart'
import SpotPriceCardTitle from '../../common/SpotPriceChartTitle'

type Props = {
  marketAddressOrName: string
}

const TradePriceCard = ({ marketAddressOrName }: Props): CardElement => {
  const [period, setPeriod] = useState(ChartPeriod.OneDay)
  const [spotPrice, setSpotPrice] = useState<number | null>(null)
  const isMobile = useIsMobile()
  return (
    <Card>
      {/* No top spacing on mobile */}
      <CardBody pt={isMobile ? 0 : 6}>
        <Flex alignItems="flex-start">
          <SpotPriceCardTitle marketAddressOrName={marketAddressOrName} period={period} hoverSpotPrice={spotPrice} />
          {!isMobile ? <ChartPeriodSelector ml="auto" period={period} onChangePeriod={setPeriod} /> : null}
        </Flex>
        <SpotPriceChart
          onHover={setSpotPrice}
          hoverSpotPrice={spotPrice}
          height={[120, 200]}
          marketAddressOrName={marketAddressOrName}
          period={period}
        />
        {isMobile ? (
          <Center mt={2}>
            <ChartPeriodSelector period={period} onChangePeriod={setPeriod} />
          </Center>
        ) : null}
      </CardBody>
    </Card>
  )
}

export default TradePriceCard

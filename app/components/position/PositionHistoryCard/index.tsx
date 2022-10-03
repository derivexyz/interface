import Card, { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Text from '@lyra/ui/components/Text'
import { Position } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import filterNulls from '@/app/utils/filterNulls'
import getExplorerUrl from '@/app/utils/getExplorerUrl'
import getOptimismChainId from '@/app/utils/getOptimismChainId'

import TradeEventsTable from '../../common/TradeEventsTable'

type Props = {
  position: Position
}

export default function PositionHistoryCard({ position }: Props): CardElement {
  const events = useMemo(() => {
    if (position) {
      return filterNulls([
        ...position.trades(),
        ...position.collateralUpdates().filter(c => c.isAdjustment),
        position.settle(),
      ])
        .sort((a, b) => b.blockNumber - a.blockNumber)
        .map(event => ({ event, position }))
    } else {
      return []
    }
  }, [position])

  return (
    <Card>
      <CardBody noPadding>
        <Text variant="heading" mx={6} my={4}>
          History
        </Text>
        <TradeEventsTable
          events={events}
          hideOption
          onClick={event => window.open(getExplorerUrl(getOptimismChainId(), event.transactionHash), '_blank')}
        />
      </CardBody>
    </Card>
  )
}

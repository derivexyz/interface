import Card, { CardElement } from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Text from '@lyra/ui/components/Text'
import { Position } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import filterNulls from '@/app/utils/filterNulls'
import getExplorerUrl from '@/app/utils/getExplorerUrl'

import TradeEventsTable from '../../common/TradeEventsTable'

type Props = {
  position: Position
}

const PositionHistoryCard = ({ position }: Props): CardElement => {
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
      <CardSection noSpacing>
        <Text variant="cardHeading">History</Text>
      </CardSection>
      <CardSection noPadding={events.length > 0}>
        {!events.length ? (
          <Text variant="small" color="secondaryText">
            Syncing trade history...
          </Text>
        ) : (
          <TradeEventsTable
            events={events}
            onClick={event => window.open(getExplorerUrl(event.lyra.network, event.transactionHash), '_blank')}
          />
        )}
      </CardSection>
    </Card>
  )
}

export default PositionHistoryCard

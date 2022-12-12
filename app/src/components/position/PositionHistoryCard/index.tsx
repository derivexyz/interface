import Card, { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { Position } from '@lyrafinance/lyra-js'
import React, { useMemo } from 'react'

import withSuspense from '@/app/hooks/data/withSuspense'
import useAccountRewardEpochs from '@/app/hooks/rewards/useAccountRewardEpochs'
import filterNulls from '@/app/utils/filterNulls'
import getExplorerUrl from '@/app/utils/getExplorerUrl'
import getOptimismChainId from '@/app/utils/getOptimismChainId'

import TradeEventsTable from '../../common/TradeEventsTable'

type Props = {
  position: Position
}

const PositionHistoryCard = withSuspense(
  ({ position }: Props): CardElement => {
    const accountRewardEpochs = useAccountRewardEpochs()
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
            accountRewardEpochs={accountRewardEpochs}
            hideOption
            onClick={event => window.open(getExplorerUrl(getOptimismChainId(), event.transactionHash), '_blank')}
          />
        </CardBody>
      </Card>
    )
  },
  () => {
    return (
      <CardBody>
        <Center>
          <Spinner />
        </Center>
      </CardBody>
    )
  }
)

export default PositionHistoryCard

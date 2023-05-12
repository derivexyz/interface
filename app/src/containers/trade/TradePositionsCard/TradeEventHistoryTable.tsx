import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import TradeEventsTable from '@/app/components/common/TradeEventsTable'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useTradeHistory from '@/app/hooks/position/useTradeHistory'
import useAccountRewardEpochs from '@/app/hooks/rewards/useAccountRewardEpochs'
import getPagePath from '@/app/utils/getPagePath'

const TradeEventHistoryTable = withSuspense(
  () => {
    const events = useTradeHistory()
    const navigate = useNavigate()
    const accountRewardEpochs = useAccountRewardEpochs()
    if (!events.length) {
      return (
        <CardBody>
          <Text variant="small" color="secondaryText">
            You have no trades.
          </Text>
        </CardBody>
      )
    }
    return (
      <TradeEventsTable
        events={events}
        accountRewardEpochs={accountRewardEpochs}
        pageSize={5}
        onClick={tradeEvent =>
          navigate(
            getPagePath({
              page: PageId.Position,
              network: tradeEvent.lyra.network,
              positionId: tradeEvent.positionId,
              marketAddressOrName: tradeEvent.marketName,
            })
          )
        }
      />
    )
  },
  () => (
    <Center flexGrow={1} width="100%" height={450}>
      <Spinner />
    </Center>
  )
)

export default TradeEventHistoryTable

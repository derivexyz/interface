import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
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
        <Flex>
          <CardBody>
            <Text variant="secondary" color="secondaryText">
              You have no trade history
            </Text>
          </CardBody>
        </Flex>
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
    <CardBody>
      <Center>
        <Spinner />
      </Center>
    </CardBody>
  )
)

export default TradeEventHistoryTable

import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { useRouter } from 'next/router'
import React from 'react'

import TradeEventsTable from '@/app/components/common/TradeEventsTable'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useTradeHistory from '@/app/hooks/position/useTradeHistory'
import getPagePath from '@/app/utils/getPagePath'

const TradeEventHistoryTable = withSuspense(
  () => {
    const events = useTradeHistory()
    const { push } = useRouter()
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
        pageSize={5}
        onClick={tradeEvent =>
          push(
            getPagePath({
              page: PageId.Position,
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

import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { useRouter } from 'next/router'
import React from 'react'

import PositionHistoryTable from '@/app/components/common/PositionHistoryTable'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import usePositionHistory from '@/app/hooks/position/usePositionHistory'
import getPagePath from '@/app/utils/getPagePath'

const TradePositionHistoryTable = withSuspense(
  () => {
    const positions = usePositionHistory()
    const { push } = useRouter()
    if (!positions.length) {
      return (
        <Flex>
          <CardBody>
            <Text variant="secondary" color="secondaryText">
              You have no closed positions
            </Text>
          </CardBody>
        </Flex>
      )
    }
    return (
      <PositionHistoryTable
        positions={positions}
        onClick={position =>
          push(
            getPagePath({ page: PageId.Position, positionId: position.id, marketAddressOrName: position.marketName })
          )
        }
        pageSize={5}
      />
    )
  },
  () => (
    <CardBody>
      <Center height={200}>
        <Spinner />
      </Center>
    </CardBody>
  )
)

export default TradePositionHistoryTable

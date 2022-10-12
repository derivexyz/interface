import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { useRouter } from 'next/router'
import React from 'react'

import PositionsTable from '@/app/components/common/PositionsTable'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useOpenPositions from '@/app/hooks/position/useOpenPositions'
import getPagePath from '@/app/utils/getPagePath'

const TradeOpenPositionsTable = withSuspense(
  () => {
    const openPositions = useOpenPositions()
    const { push } = useRouter()
    if (!openPositions.length) {
      return (
        <Flex>
          <CardBody>
            <Text variant="secondary" color="secondaryText">
              You have no open positions
            </Text>
          </CardBody>
        </Flex>
      )
    }
    return (
      <PositionsTable
        positions={openPositions}
        onClick={position =>
          push(
            getPagePath({ page: PageId.Position, positionId: position.id, marketAddressOrName: position.marketName })
          )
        }
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

export default TradeOpenPositionsTable

import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import List from '@lyra/ui/components/List'
import ListItem from '@lyra/ui/components/List/ListItem'
import Shimmer from '@lyra/ui/components/Shimmer'
import Text from '@lyra/ui/components/Text'
import formatDateTime from '@lyra/ui/utils/formatDateTime'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLiveBoards from '@/app/hooks/market/useLiveBoards'
import getPagePath from '@/app/utils/getPagePath'

type Props = { market: Market }

const AdminMarketBoardsInfo = withSuspense(
  ({ market }: Props) => {
    const boards = useLiveBoards(market.address)
    if (!boards) {
      return (
        <Card mx={8} mt={4} p={4}>
          No boards for {market?.name}
        </Card>
      )
    }
    return (
      <Card mx={8} mt={4}>
        <CardBody noPadding>
          <Text mx={6} mt={4} variant="heading">
            Boards
          </Text>
          <List mt={2}>
            {boards.map(board => (
              <ListItem
                key={board.id}
                href={getPagePath({ page: PageId.AdminBoard, marketAddressOrName: market.name, boardId: board.id })}
                label={
                  <Box>
                    <Text>Board #{board.id}</Text>
                    <Text variant="secondary" color="secondaryText">
                      Expires {formatDateTime(board.expiryTimestamp)}
                    </Text>
                  </Box>
                }
              />
            ))}
          </List>
        </CardBody>
      </Card>
    )
  },
  () => (
    <Card mx={8} mt={4}>
      <CardBody noPadding>
        <Text mx={6} mt={4} variant="heading">
          Boards
        </Text>
        <List mt={2}>
          <Shimmer mx={6} my={4} height={45}></Shimmer>
          <Shimmer mx={6} my={4} height={45}></Shimmer>
          <Shimmer mx={6} my={4} height={45}></Shimmer>
        </List>
      </CardBody>
    </Card>
  )
)

export default AdminMarketBoardsInfo

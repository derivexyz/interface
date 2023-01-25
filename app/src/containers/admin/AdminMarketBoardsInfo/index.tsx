import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import List from '@lyra/ui/components/List'
import ListItem from '@lyra/ui/components/List/ListItem'
import Text from '@lyra/ui/components/Text'
import formatDateTime from '@lyra/ui/utils/formatDateTime'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'

import { PageId } from '@/app/constants/pages'
import getPagePath from '@/app/utils/getPagePath'

type Props = { market: Market }

const AdminMarketBoardsInfo = ({ market }: Props) => {
  const boards = market.liveBoards()
  return (
    <Card>
      <CardBody noPadding>
        <Text m={6} variant="heading">
          Boards
        </Text>
        <List>
          {boards.map(board => (
            <ListItem
              key={board.id}
              href={getPagePath({
                page: PageId.AdminBoard,
                network: market.lyra.network,
                marketAddressOrName: market.name,
                boardId: board.id,
              })}
              label={
                <Box ml={3}>
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
}

export default AdminMarketBoardsInfo

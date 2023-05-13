import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import { Position } from '@lyrafinance/lyra-js'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import PositionsTable from '@/app/components/common/PositionsTable'
import { PageId } from '@/app/constants/pages'
import getPagePath from '@/app/utils/getPagePath'

type Props = { openPositions: Position[] }

const TradePositionsCard = ({ openPositions }: Props) => {
  const navigate = useNavigate()
  return (
    <>
      <CardSection noSpacing>
        <Flex>
          <Text variant="cardHeading">Open Positions</Text>
          <Button
            ml="auto"
            variant="light"
            label="History"
            rightIcon={IconType.ArrowRight}
            href={getPagePath({ page: PageId.TradeHistory })}
          />
        </Flex>
      </CardSection>
      <CardSection noPadding>
        {openPositions.length > 0 ? (
          <PositionsTable
            positions={openPositions}
            onClick={position =>
              navigate(
                getPagePath({
                  page: PageId.Position,
                  network: position.lyra.network,
                  positionId: position.id,
                  marketAddressOrName: position.marketName,
                })
              )
            }
            mb={3}
            pageSize={5}
          />
        ) : (
          <Box px={[3, 6]} pb={[3, 6]}>
            <Text variant="small" color="secondaryText">
              You have no open positions.
            </Text>
          </Box>
        )}
      </CardSection>
    </>
  )
}

export default TradePositionsCard

import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Card, { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import { Position } from '@lyrafinance/lyra-js'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import PositionsTable from '@/app/components/common/PositionsTable'
import { PageId } from '@/app/constants/pages'
import useNetwork from '@/app/hooks/account/useNetwork'
import useWallet from '@/app/hooks/account/useWallet'
import { getDefaultMarket } from '@/app/utils/getDefaultMarket'
import getPagePath from '@/app/utils/getPagePath'

type Props = {
  openPositions: Position[]
}

const PortfolioOpenPositionsCard = ({ openPositions }: Props): CardElement => {
  const { isConnected } = useWallet()

  const navigate = useNavigate()
  const network = useNetwork()

  return (
    <Card overflow="hidden">
      <CardBody noPadding>
        <Flex px={6} alignItems="center">
          <Text my={4} variant="heading">
            Open Positions
          </Text>
          {isConnected ? (
            <Button ml="auto" variant="light" label="History →" href={getPagePath({ page: PageId.History })} />
          ) : null}
        </Flex>
        {openPositions.length > 0 ? (
          <PositionsTable
            positions={openPositions}
            onClick={position =>
              navigate(
                getPagePath({
                  page: PageId.Position,
                  network: position.lyra.network,
                  marketAddressOrName: position.marketName,
                  positionId: position.id,
                })
              )
            }
          />
        ) : (
          <Box mx={6} mb={6}>
            <Text variant="secondary" color="secondaryText" mb={6}>
              You have no open positions
            </Text>
            <Button
              variant="primary"
              label="Start Trading"
              width={200}
              size="lg"
              rightIcon={IconType.ArrowRight}
              href={getPagePath({
                page: PageId.Trade,
                network: network,
                marketAddressOrName: getDefaultMarket(network),
              })}
            />
          </Box>
        )}
      </CardBody>
    </Card>
  )
}

export default PortfolioOpenPositionsCard

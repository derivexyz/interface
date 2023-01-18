import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Card, { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import TextShimmer from '@lyra/ui/components/Shimmer/TextShimmer'
import Text from '@lyra/ui/components/Text'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import PositionsTable from '@/app/components/common/PositionsTable'
import { getDefaultMarket } from '@/app/constants/defaults'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useOpenPositions from '@/app/hooks/position/useOpenPositions'
import useWallet from '@/app/hooks/wallet/useWallet'
import getPagePath from '@/app/utils/getPagePath'
import useDefaultNetwork from '@/app/utils/useDefaultNetwork'

const PortfolioOpenPositionsTable = withSuspense(
  (): CardElement => {
    const openPositions = useOpenPositions()
    const navigate = useNavigate()
    const defaultNetwork = useDefaultNetwork()
    return openPositions.length > 0 ? (
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
            network: defaultNetwork,
            marketAddressOrName: getDefaultMarket(defaultNetwork),
          })}
        />
      </Box>
    )
  },
  () => (
    <Box height={125} px={6}>
      <TextShimmer variant="secondary" mb={6} width={120} />
      <ButtonShimmer size="lg" width={200} />
    </Box>
  )
)

const PortfolioOpenPositionsCard = (): CardElement => {
  const { isConnected } = useWallet()
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
        <PortfolioOpenPositionsTable />
      </CardBody>
    </Card>
  )
}

export default PortfolioOpenPositionsCard

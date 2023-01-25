import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import PositionHistoryTable from '@/app/components/common/PositionHistoryTable'
import { PageId } from '@/app/constants/pages'
import useWallet from '@/app/hooks/account/useWallet'
import withSuspense from '@/app/hooks/data/withSuspense'
import usePositionHistory from '@/app/hooks/position/usePositionHistory'
import getPagePath from '@/app/utils/getPagePath'

import ConnectWalletButton from '../../common/ConnectWalletButton'

type Props = {
  market: Market
}

const TradePositionHistoryTable = withSuspense(
  ({ market }: Props) => {
    const positions = usePositionHistory()
    const { isConnected } = useWallet()
    const navigate = useNavigate()
    if (!positions.length) {
      return (
        <CardBody height={112} justifyContent="center">
          {isConnected ? (
            <Card variant="nested" width={232}>
              <CardBody p={4}>
                <Text variant="secondary" color="secondaryText">
                  You have no closed positions
                </Text>
              </CardBody>
            </Card>
          ) : (
            <ConnectWalletButton size="lg" width={200} network={market.lyra.network} />
          )}
        </CardBody>
      )
    }
    return (
      <PositionHistoryTable
        positions={positions}
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
        pageSize={5}
      />
    )
  },
  () => (
    <CardBody height={112}>
      <Center width="100%" height="100%">
        <Spinner />
      </Center>
    </CardBody>
  )
)

export default TradePositionHistoryTable

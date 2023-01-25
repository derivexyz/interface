import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Text from '@lyra/ui/components/Text'
import { Market, Position } from '@lyrafinance/lyra-js'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import PositionsTable from '@/app/components/common/PositionsTable'
import { PageId } from '@/app/constants/pages'
import useWallet from '@/app/hooks/account/useWallet'
import getPagePath from '@/app/utils/getPagePath'

import ConnectWalletButton from '../../common/ConnectWalletButton'

type Props = { market: Market; openPositions: Position[] }

const TradeOpenPositionsTable = ({ market, openPositions }: Props) => {
  const navigate = useNavigate()
  const { isConnected } = useWallet()
  if (!openPositions.length) {
    return (
      <CardBody height={112} justifyContent="center">
        {isConnected ? (
          <Card variant="nested" width={220}>
            <CardBody p={4}>
              <Text variant="secondary" color="secondaryText">
                You have no open positions
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
    />
  )
}

export default TradeOpenPositionsTable

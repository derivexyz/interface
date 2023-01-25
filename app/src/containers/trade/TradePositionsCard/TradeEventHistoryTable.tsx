import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import { Market } from '@lyrafinance/lyra-js'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import TradeEventsTable from '@/app/components/common/TradeEventsTable'
import { PageId } from '@/app/constants/pages'
import useWallet from '@/app/hooks/account/useWallet'
import withSuspense from '@/app/hooks/data/withSuspense'
import useTradeHistory from '@/app/hooks/position/useTradeHistory'
import useAccountRewardEpochs from '@/app/hooks/rewards/useAccountRewardEpochs'
import getPagePath from '@/app/utils/getPagePath'

import ConnectWalletButton from '../../common/ConnectWalletButton'

type Props = {
  market: Market
}

const TradeEventHistoryTable = withSuspense(
  ({ market }: Props) => {
    const events = useTradeHistory()
    const { isConnected } = useWallet()
    const navigate = useNavigate()
    const accountRewardEpochs = useAccountRewardEpochs()
    if (!events.length) {
      return (
        <CardBody height={112} justifyContent="center">
          {isConnected ? (
            <Card variant="nested" width={165}>
              <CardBody p={4}>
                <Text variant="secondary" color="secondaryText">
                  You have no trades
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
      <TradeEventsTable
        events={events}
        accountRewardEpochs={accountRewardEpochs}
        pageSize={5}
        onClick={tradeEvent =>
          navigate(
            getPagePath({
              page: PageId.Position,
              network: tradeEvent.lyra.network,
              positionId: tradeEvent.positionId,
              marketAddressOrName: tradeEvent.marketName,
            })
          )
        }
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

export default TradeEventHistoryTable

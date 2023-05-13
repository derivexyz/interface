import IconButton from '@lyra/ui/components/Button/IconButton'
import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import ToggleButtonItem from '@lyra/ui/components/Button/ToggleButtonItem'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import React, { useMemo, useState } from 'react'
import { CSVLink } from 'react-csv'
import { useNavigate } from 'react-router-dom'

import PositionHistoryTable from '@/app/components/common/PositionHistoryTable'
import TradeEventsTable from '@/app/components/common/TradeEventsTable'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import usePositionHistory from '@/app/hooks/position/usePositionHistory'
import useTradeHistory from '@/app/hooks/position/useTradeHistory'
import useAccountRewardEpochs from '@/app/hooks/rewards/useAccountRewardEpochs'
import getPagePath from '@/app/utils/getPagePath'
import { getTradeHistoryCSV } from '@/app/utils/getTradeHistoryCSV'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

enum HistoryTab {
  Trade = 'trade',
  Position = 'position',
}

const PositionHistory = withSuspense(
  () => {
    const positions = usePositionHistory()
    const navigate = useNavigate()
    return positions.length > 0 ? (
      <CardSection noPadding>
        <PositionHistoryTable
          positions={positions}
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
          pageSize={10}
        />
      </CardSection>
    ) : (
      <CardSection>
        <Text variant="small" color="secondaryText">
          You have no closed positions.
        </Text>
      </CardSection>
    )
  },
  () => (
    <Center height="100%" minHeight={120}>
      <Spinner />
    </Center>
  )
)

const DownloadTradeHistory = withSuspense(() => {
  const history = useTradeHistory()
  const { headers, data } = useMemo(() => {
    const { headers, data } = getTradeHistoryCSV(history.map(h => h.event))
    return {
      headers,
      data,
    }
  }, [history])
  return data.length > 0 ? (
    <Flex ml="auto">
      <CSVLink data={data} headers={headers} filename={'lyra_trade_history.csv'}>
        <IconButton icon={IconType.Download} variant="light" />
      </CSVLink>
    </Flex>
  ) : null
})

const TradeHistory = withSuspense(
  () => {
    const events = useTradeHistory()
    const navigate = useNavigate()
    const accountRewardEpochs = useAccountRewardEpochs()
    return events.length > 0 ? (
      <CardSection noPadding>
        <TradeEventsTable
          events={events}
          accountRewardEpochs={accountRewardEpochs}
          onClick={event => {
            const positionId = event.positionId
            return navigate(
              getPagePath({
                page: PageId.Position,
                network: event.lyra.network,
                marketAddressOrName: event.marketName,
                positionId: positionId,
              })
            )
          }}
        />
      </CardSection>
    ) : (
      <CardSection>
        <Text variant="small" color="secondaryText">
          You have no trades.
        </Text>
      </CardSection>
    )
  },
  () => (
    <Center height="100%" minHeight={120}>
      <Spinner />
    </Center>
  )
)

export default function TradeHistoryPageHelper(): JSX.Element {
  const [table, setTable] = useState(HistoryTab.Position)
  return (
    <Page showBackButton backHref={getPagePath({ page: PageId.TradeIndex })}>
      <PageGrid>
        <Text variant="heading">History</Text>
        <Card overflow="hidden">
          <CardSection noSpacing>
            <Flex>
              <ToggleButton>
                {[
                  { label: 'Closed', id: HistoryTab.Position },
                  { label: 'Trades', id: HistoryTab.Trade },
                ].map(item => (
                  <ToggleButtonItem
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    isSelected={table === item.id}
                    onSelect={val => setTable(val)}
                  />
                ))}
              </ToggleButton>
              <DownloadTradeHistory />
            </Flex>
          </CardSection>
          {table === HistoryTab.Trade ? <TradeHistory /> : null}
          {table === HistoryTab.Position ? <PositionHistory /> : null}
        </Card>
      </PageGrid>
    </Page>
  )
}

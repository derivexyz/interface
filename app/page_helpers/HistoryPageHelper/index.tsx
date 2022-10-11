import IconButton from '@lyra/ui/components/Button/IconButton'
import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import coerce from '@lyra/ui/utils/coerce'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { CSVLink } from 'react-csv'

import PositionHistoryTable from '@/app/components/common/PositionHistoryTable'
import TradeEventsTable from '@/app/components/common/TradeEventsTable'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import usePositionHistory from '@/app/hooks/position/usePositionHistory'
import useTradeHistory from '@/app/hooks/position/useTradeHistory'
import useQueryParam from '@/app/hooks/url/useQueryParam'
import getPagePath from '@/app/utils/getPagePath'
import { getTradeHistoryCSV } from '@/app/utils/getTradeHistoryCSV'

import Layout from '../common/Layout'
import LayoutGrid from '../common/Layout/LayoutGrid'

enum HistoryTab {
  Trade = 'trade',
  Position = 'position',
}

const PositionHistory = withSuspense(
  () => {
    const positions = usePositionHistory()
    const router = useRouter()
    return positions.length > 0 ? (
      <PositionHistoryTable
        positions={positions}
        onClick={position =>
          router.push(
            getPagePath({ page: PageId.Position, marketAddressOrName: position.marketName, positionId: position.id })
          )
        }
        pageSize={10}
      />
    ) : (
      <Text mx={6} mb={6} variant="secondary" color="secondaryText">
        You have no position history
      </Text>
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
    const router = useRouter()
    return events.length > 0 ? (
      <TradeEventsTable
        events={events}
        onClick={event => {
          const positionId = event.positionId
          return router.push(
            getPagePath({ page: PageId.Position, marketAddressOrName: event.marketName, positionId: positionId })
          )
        }}
      />
    ) : (
      <Text mx={6} mb={6} variant="secondary" color="secondaryText">
        You have no trade history
      </Text>
    )
  },
  () => (
    <Center height="100%" minHeight={120}>
      <Spinner />
    </Center>
  )
)

export default function HistoryPageHelper(): JSX.Element {
  const [tableRaw, setTable] = useQueryParam('tab')
  const table = coerce(HistoryTab, tableRaw) ?? HistoryTab.Position
  return (
    <Layout mobileHeader="History" desktopHeader="History" showBackButton mobileCollapsedHeader="History">
      <LayoutGrid>
        <Card overflow="hidden">
          <CardBody noPadding>
            <Flex p={6}>
              <ToggleButton
                items={[
                  { label: 'Positions', id: HistoryTab.Position },
                  { label: 'Trade', id: HistoryTab.Trade },
                ]}
                selectedItemId={table}
                onChange={val => setTable(val)}
              />
              <DownloadTradeHistory />
            </Flex>
            {table === HistoryTab.Trade ? <TradeHistory /> : null}
            {table === HistoryTab.Position ? <PositionHistory /> : null}
          </CardBody>
        </Card>
      </LayoutGrid>
    </Layout>
  )
}

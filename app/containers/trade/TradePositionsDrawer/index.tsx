import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Collapsible from '@lyra/ui/components/Collapsible'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import Token from '@lyra/ui/components/Token'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'

import PositionsTable from '@/app/components/common/PositionsTable'
import { LogEvent } from '@/app/constants/logEvents'
import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useMarket from '@/app/hooks/market/useMarket'
import useOpenPositions from '@/app/hooks/position/useOpenPositions'
import getPagePath from '@/app/utils/getPagePath'
import logEvent from '@/app/utils/logEvent'

type Props = {
  marketAddressOrName: string
  isExpanded: boolean
  onToggleExpanded: (isExpanded: boolean) => void
}

export const TRADE_POSITIONS_DRAWER_HEIGHT = 60

const TradePositionsDrawer = withSuspense(({ marketAddressOrName, isExpanded, onToggleExpanded }: Props) => {
  const positions = useOpenPositions()
  const market = useMarket(marketAddressOrName)
  const openPositions = useMemo(
    () =>
      positions
        .filter(position => position.marketAddress === market?.address)
        .sort((a, b) => a.expiryTimestamp - b.expiryTimestamp),
    [positions, market]
  )

  const router = useRouter()

  if (openPositions.length === 0) {
    return null
  }

  return (
    <Card variant="modal" sx={{ borderBottomRightRadius: '0px !important', borderBottomLeftRadius: '0px !important' }}>
      <CardBody noPadding>
        <Collapsible
          onClick={() => {
            const newIsExpanded = !isExpanded
            onToggleExpanded(newIsExpanded)
            logEvent(newIsExpanded ? LogEvent.BoardOpenPositionsExpand : LogEvent.BoardOpenPositionsCollapse, {
              marketName: market?.name,
              marketAddress: market?.address,
              numPositions: positions.length,
            })
          }}
          header={
            <>
              <Text variant="heading">Open Positions</Text>
              <Token ml={2} variant="primary" label={openPositions.length.toString()} />
              <Icon
                size={18}
                ml="auto"
                color="secondaryText"
                icon={isExpanded ? IconType.Minimize2 : IconType.Maximize2}
              />
            </>
          }
          isExpanded={isExpanded}
          maxHeight="35vh"
        >
          <PositionsTable
            positions={openPositions}
            onClick={position =>
              router.push(
                getPagePath({
                  page: PageId.Position,
                  marketAddressOrName: position.marketName,
                  positionId: position.id,
                })
              )
            }
          />
        </Collapsible>
      </CardBody>
    </Card>
  )
})

export default TradePositionsDrawer

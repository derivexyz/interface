import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatDate from '@lyra/ui/utils/formatDate'
import { Option, Position } from '@lyrafinance/lyra-js'
import React from 'react'

import PositionCard from '@/app/components/position/PositionCard'
import PositionHistoryCard from '@/app/components/position/PositionHistoryCard'
import PositionStatsCard from '@/app/components/position/PositionStatsCard'
import PositionChartCard from '@/app/containers/position/PositionChartCard'
import fromBigNumber from '@/app/utils/fromBigNumber'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  position: Position
  option: Option
}

const PositionPageHelper = ({ position, option }: Props): JSX.Element => {
  const strikePrice = position.strikePrice
  const expiryTimestamp = position.expiryTimestamp
  const isCall = position.isCall
  const marketName = position.market().baseToken.symbol
  const isMobile = useIsMobile()
  const titleText = (
    <Text variant="title">
      {marketName} ${fromBigNumber(strikePrice)} {isCall ? 'Call' : 'Put'}
      <Text as="span" color="secondaryText">
        {isMobile ? <br /> : ' · '}
        {formatDate(expiryTimestamp, true)} Exp
      </Text>
    </Text>
  )
  const collapsedTitleText = (
    <Text variant="secondary">
      {marketName} ${fromBigNumber(strikePrice)} {isCall ? 'Call' : 'Put'}
      <Text as="span" color="secondaryText">
        {' · '}
        {formatDate(expiryTimestamp, true)} Exp
      </Text>
    </Text>
  )

  return (
    <Page mobileCollapsedHeader={collapsedTitleText} header={titleText}>
      <PageGrid>
        <PositionChartCard option={option} />
        <PositionCard position={position} option={option} />
        {position.isOpen ? <PositionStatsCard option={option} /> : null}
        {position && position.trades().length > 0 ? <PositionHistoryCard position={position} /> : null}
      </PageGrid>
    </Page>
  )
}

export default PositionPageHelper

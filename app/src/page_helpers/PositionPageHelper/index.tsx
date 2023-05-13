import Text from '@lyra/ui/components/Text'
import formatDate from '@lyra/ui/utils/formatDate'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Option, Position } from '@lyrafinance/lyra-js'
import React from 'react'

import PositionCard from '@/app/components/position/PositionCard'
import PositionHistoryCard from '@/app/components/position/PositionHistoryCard'
import PositionStatsCard from '@/app/components/position/PositionStatsCard'
import { PageId } from '@/app/constants/pages'
import PositionChartCard from '@/app/containers/position/PositionChartCard'
import formatTokenName from '@/app/utils/formatTokenName'
import getPagePath from '@/app/utils/getPagePath'

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
  const baseName = formatTokenName(position.market().baseToken)
  return (
    <Page
      showBackButton
      backHref={getPagePath({
        page: PageId.Trade,
        marketAddressOrName: position.market().name,
        network: position.lyra.network,
      })}
    >
      <PageGrid>
        <Text mx={[3, 0]} variant="heading">
          {baseName} {formatUSD(strikePrice)} {isCall ? 'Call' : 'Put'}
          <Text as="span" color="secondaryText">
            &nbsp;·&nbsp;{formatDate(expiryTimestamp, true)} Exp
          </Text>
        </Text>
        <PositionChartCard option={option} />
        <PositionCard position={position} option={option} />
        {position.isOpen ? <PositionStatsCard option={option} /> : null}
        {position && position.trades().length > 0 ? <PositionHistoryCard position={position} /> : null}
      </PageGrid>
    </Page>
  )
}

export default PositionPageHelper

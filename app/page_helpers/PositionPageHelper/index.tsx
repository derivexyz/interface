import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatDate from '@lyra/ui/utils/formatDate'
import { Option, Position } from '@lyrafinance/lyra-js'
import React from 'react'

import PositionCard from '@/app/components/position/PositionCard'
import PositionHistoryCard from '@/app/components/position/PositionHistoryCard'
import PositionShareCard from '@/app/components/position/PositionShareCard'
import PositionStatsCard from '@/app/components/position/PositionStatsCard'
import PositionChartCard from '@/app/containers/position/PositionChartCard'
import fromBigNumber from '@/app/utils/fromBigNumber'

import Layout from '../common/Layout'
import LayoutGrid from '../common/Layout/LayoutGrid'

type Props = {
  position: Position
  option: Option
}

const PositionPageHelper = ({ position, option }: Props): JSX.Element => {
  const strikePrice = position.strikePrice
  const expiryTimestamp = position.expiryTimestamp
  const isCall = position.isCall
  const marketName = position.marketName
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
    <Layout mobileCollapsedHeader={collapsedTitleText} header={titleText}>
      <LayoutGrid>
        <PositionChartCard option={option} />
        {position ? (
          <>
            {isMobile ? (
              <>
                <PositionCard position={position} option={option} />
                <PositionShareCard position={position} />
              </>
            ) : (
              <Flex>
                <PositionShareCard mr={6} position={position} />
                <PositionCard position={position} option={option} />
              </Flex>
            )}
          </>
        ) : null}
        <PositionStatsCard position={position} option={option} />
        {position && position.trades().length > 0 ? <PositionHistoryCard position={position} /> : null}
      </LayoutGrid>
    </Layout>
  )
}

export default PositionPageHelper

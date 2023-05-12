import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Text from '@lyra/ui/components/Text'
import { Option } from '@lyrafinance/lyra-js'
import React from 'react'

import useOptionQuotesSync from '@/app/hooks/market/useOptionQuotesSync'
import getDefaultQuoteSize from '@/app/utils/getDefaultQuoteSize'

import OptionStatsGrid from '../../common/OptionStatsGrid'

type Props = {
  option: Option
}

const PositionStatsCard = ({ option }: Props): JSX.Element | null => {
  const { bid, ask } = useOptionQuotesSync(option, getDefaultQuoteSize(option.market().name))
  return (
    <Card>
      <CardSection>
        <Text variant="cardHeading" mb={6}>
          Stats
        </Text>
        <OptionStatsGrid option={option} bid={bid} ask={ask} />
      </CardSection>
    </Card>
  )
}

export default PositionStatsCard

import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Text from '@lyra/ui/components/Text'
import { Option, Position } from '@lyrafinance/lyra-js'
import React from 'react'

import OptionStatsGrid from '../../common/OptionStatsGrid'

type Props = {
  position: Position
  option: Option
}

const PositionStatsCard = ({ option, position }: Props): JSX.Element | null => {
  return (
    <Card>
      <CardSection>
        <Text variant="heading" mb={6}>
          Stats
        </Text>
        <OptionStatsGrid option={option} isBuy={position.isLong} />
      </CardSection>
    </Card>
  )
}

export default PositionStatsCard

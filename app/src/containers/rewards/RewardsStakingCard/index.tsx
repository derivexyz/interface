import Card, { CardElement } from '@lyra/ui/components/Card'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import NotStakedCardSection from './NotStakedCardSection'
import StakedCardSection from './StakedCardSection'

type Props = MarginProps

const RewardsStakingCard = ({ ...marginProps }: Props): CardElement => {
  const isMobile = useIsMobile()
  return (
    <Card flexDirection={isMobile ? 'column' : 'row'} {...marginProps}>
      <StakedCardSection />
      <CardSeparator isVertical={!isMobile} />
      <NotStakedCardSection />
    </Card>
  )
}

export default RewardsStakingCard

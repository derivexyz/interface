import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import formatTruncatedNumber from '@lyra/ui/utils/formatTruncatedNumber'
import React from 'react'

import { CompetitionPool, CompetitionSeasonConfig } from '@/app/constants/competition'

import CompetitionPrizePoolCardsYourRank from './CompetitionPrizePoolCardsYourRank'

type Props = {
  selectedSeason: CompetitionSeasonConfig
  selectedPool: CompetitionPool
  onClick: (poolIdx: number) => void
}

const CompetitionPrizePoolCards = ({ selectedPool, selectedSeason, onClick }: Props) => {
  const poolCards = selectedSeason.pools.map((pool, idx) => (
    <Card
      onClick={() => onClick(idx)}
      key={pool.name}
      sx={{
        border: '1px solid',
        borderColor: pool.name === selectedPool.name ? 'primaryLine' : 'transparent',
        ':hover': {
          cursor: 'pointer',
          border: '1px solid',
          borderColor: 'primaryLine',
          bg: 'hover',
        },
        ':active': {
          bg: 'active',
        },
        borderRadius: 'card',
      }}
    >
      <CardBody height="100%" justifyContent="center">
        <Text variant="heading">Prize Pool {idx + 1}</Text>
        <Text variant="bodyLarge" color="secondaryText">
          {pool.name} · {formatTruncatedNumber(pool.totalPrizePool)} OP
        </Text>
        <CompetitionPrizePoolCardsYourRank mt={9} pool={pool} />
      </CardBody>
    </Card>
  ))

  return (
    <Grid width="100%" sx={{ gridTemplateColumns: '1fr 1fr 1fr', columnGap: 4 }}>
      {poolCards}
    </Grid>
  )
}

export default CompetitionPrizePoolCards

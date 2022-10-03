import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React, { useState } from 'react'

import CompetitionBanner from '@/app/components/competition/CompetitionBanner'
import { COMPETITION_SEASONS_CONFIG, CompetitionSeasonConfig } from '@/app/constants/competition'
import CompetitionGlobalPrizePoolCard from '@/app/containers/competition/CompetitionGlobalPrizePoolCard'
import CompetitionPrizePoolCards from '@/app/containers/competition/CompetitionPrizePoolCards'
import useNumberQueryParam from '@/app/hooks/url/useNumberQueryParam'

import Layout from '../common/Layout'
import LayoutGrid from '../common/Layout/LayoutGrid'

const CompetitionPageHelper = (): JSX.Element => {
  const isMobile = useIsMobile()
  const [_selectedPoolIdx, setSelectedPoolIdx] = useNumberQueryParam('pool')
  const [selectedSeason, _setSelectedSeason] = useState<CompetitionSeasonConfig>(COMPETITION_SEASONS_CONFIG[0])
  const selectedPoolIdx = _selectedPoolIdx ?? 0
  const selectedPool = selectedSeason.pools[selectedPoolIdx] ?? selectedSeason.pools[0]
  return (
    <Layout>
      <LayoutGrid>
        <CompetitionBanner />
        {!isMobile ? (
          <CompetitionPrizePoolCards
            selectedSeason={selectedSeason}
            selectedPool={selectedPool}
            onClick={idx => setSelectedPoolIdx(idx)}
          />
        ) : null}
        <CompetitionGlobalPrizePoolCard
          selectedSeason={selectedSeason}
          selectedPool={selectedPool}
          selectedPoolIdx={selectedPoolIdx}
          onChangePool={idx => setSelectedPoolIdx(idx)}
        />
      </LayoutGrid>
    </Layout>
  )
}

export default CompetitionPageHelper

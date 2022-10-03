import React from 'react'

import CompetitionBannerCheckCircle from '@/app/components/competition/CompetitionBanner/CompetitionBannerCheckCircle'
import withSuspense from '@/app/hooks/data/withSuspense'
import useHopTransfersToOptimism from '@/app/hooks/gql/hop/useHopTransfersToOptimism'

const CompetitionBannerBridgeQualification = withSuspense(
  () => {
    const transfers = useHopTransfersToOptimism(0)
    const hasBridged = transfers ? transfers.length > 0 : false
    return <CompetitionBannerCheckCircle isChecked={hasBridged} />
  },
  () => <CompetitionBannerCheckCircle isChecked={false} />
)

export default CompetitionBannerBridgeQualification

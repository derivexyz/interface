import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React from 'react'

import CompetitionBannerDesktop from './CompetitionBannerDesktop'
import CompetitionBannerMobile from './CompetitionBannerMobile'

function CompetitionBanner() {
  const isMobile = useIsMobile()
  return isMobile ? <CompetitionBannerMobile /> : <CompetitionBannerDesktop />
}

export default CompetitionBanner

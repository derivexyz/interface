import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import Image from '@lyra/ui/components/Image'
import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import React from 'react'

import getAssetSrc from '@/app/utils/getAssetSrc'

import CompetitionBannerCountdown from './CompetitionBannerCountdown'
import CompetitionBannerPrizesLabel from './CompetitionBannerPrizesLabel'
import CompetitionBannerQualifications from './CompetitionBannerQualifications'

const CompetitionBannerDesktop = () => {
  const [isDarkMode] = useIsDarkMode()
  return (
    <Card height={280} sx={{ position: 'relative' }} bg="#25303B">
      <CompetitionBannerPrizesLabel sx={{ position: 'absolute', top: '10%', left: 0, transform: 'translateX(-10%)' }} />
      <CompetitionBannerQualifications width={340} ml={8} sx={{ position: 'absolute', top: '30%' }} />
      <Image
        width={450}
        src={getAssetSrc('/images/the_merge.png')}
        sx={{ position: 'absolute', top: '50%', left: '76%', transform: 'translateX(-50%)' }}
      />
      <Image
        width={80}
        src={getAssetSrc('/images/hop_badge.png')}
        sx={{
          position: 'absolute',
          top: '100%',
          left: '40%',
          transform: 'translateY(-90%) rotate(23deg)',
          opacity: 0.85,
        }}
      />
      <CompetitionBannerCountdown sx={{ position: 'absolute', top: '8%', right: 0, transform: 'translateX(7%)' }} />
      <Box ml="auto" bg={isDarkMode ? '#FFFFFFE6' : '#FFF'} height="100%" width="27.5%"></Box>
    </Card>
  )
}

export default CompetitionBannerDesktop

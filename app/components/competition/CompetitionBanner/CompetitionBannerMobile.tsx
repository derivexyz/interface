import Box from '@lyra/ui/components/Box'
import Image from '@lyra/ui/components/Image'
import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import React from 'react'
import { Flex } from 'rebass'

import getAssetSrc from '@/app/utils/getAssetSrc'

import CompetitionBannerCountdown from './CompetitionBannerCountdown'
import CompetitionBannerPrizesLabel from './CompetitionBannerPrizesLabel'
import CompetitionBannerQualifications from './CompetitionBannerQualifications'

const CompetitionBannerMobile = () => {
  const [isDarkMode] = useIsDarkMode()
  return (
    <Flex flexDirection="column" overflow="hidden">
      <Flex
        flexDirection="column"
        alignItems="center"
        height={248}
        sx={{ position: 'relative', borderBottom: '1px solid white' }}
        bg="#25303B"
      >
        <CompetitionBannerCountdown mt={6} ml="auto" mr={-18} sx={{ zIndex: 1 }} />
        <Image mb={6} mt="auto" width={340} src={getAssetSrc('/images/the_merge_mobile.png')} sx={{ zIndex: 1 }} />
        <Box
          sx={{ position: 'absolute', right: 0, zIndex: 0 }}
          width="55%"
          height="100%"
          bg={isDarkMode ? '#FFFFFFE6' : '#FFF'}
        ></Box>
      </Flex>
      <Flex flexDirection="column" height={280} sx={{ position: 'relative' }} bg="#25303B">
        <CompetitionBannerPrizesLabel mt={9} sx={{ transform: 'translateX(-10%)' }} />
        <CompetitionBannerQualifications mt={7} />
        <Image
          width={64}
          src={getAssetSrc('/images/hop_badge.png')}
          sx={{
            position: 'absolute',
            top: '33%',
            right: 0,
            transform: 'rotate(23deg)',
            opacity: 0.85,
          }}
        />
      </Flex>
    </Flex>
  )
}

export default CompetitionBannerMobile

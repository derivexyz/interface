import Box from '@lyra/ui/components/Box'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import useIsDarkMode from '@lyra/ui/hooks/useIsDarkMode'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { LayoutProps, MarginProps, SxProps } from '@lyra/ui/types'
import React from 'react'

import CompetitionBannerBridgeQualification from '@/app/containers/competition/CompetitionBannerBridgeQualification'
import CompetitionBannerPremiumsQualification from '@/app/containers/competition/CompetitionBannerPremiumsQualifications'

type Props = SxProps & MarginProps & LayoutProps

const CompetitionBannerQualifications = ({ sx, ...styleProps }: Props) => {
  const isMobile = useIsMobile()
  const [isDarkMode] = useIsDarkMode()
  return (
    <Box sx={sx} {...styleProps}>
      <Flex justifyContent="center" alignItems="center" bg="#9DFFEF" sx={{ color: '#008F76' }} width={106}>
        <Text color="inherit" variant="bodyLarge" sx={{ fontWeight: 900 }}>
          LET'S GO:
        </Text>
      </Flex>
      <Flex ml={isMobile ? 7 : 0} my={6} alignItems="center" sx={{ color: isDarkMode ? '#FFFFFFE6' : '#FFF' }}>
        <CompetitionBannerPremiumsQualification />
        <Text color="inherit" ml={4} variant="bodyLarge">
          Trade $100 or more
        </Text>
      </Flex>
      <Flex ml={isMobile ? 7 : 0} alignItems="center" sx={{ color: isDarkMode ? '#FFFFFFE6' : '#FFF' }}>
        <CompetitionBannerBridgeQualification />
        <Text color="inherit" ml={4} variant="bodyLarge">
          Bridge via Hop for a chance to win 2.5k OP
        </Text>
      </Flex>
    </Box>
  )
}

export default CompetitionBannerQualifications

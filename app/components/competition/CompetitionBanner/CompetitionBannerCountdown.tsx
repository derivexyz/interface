import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import { MarginProps, SxProps } from '@lyra/ui/types'
import React from 'react'

import { COMPETITION_SEASONS_CONFIG } from '@/app/constants/competition'

type Props = SxProps & MarginProps

const CompetitionBannerCountdown = ({ sx, ...marginProps }: Props) => {
  return (
    <Flex width={220} flexDirection="column" sx={sx} {...marginProps}>
      <Flex ml={6} justifyContent="center" alignItems="center" bg="#9DFFEF" sx={{ color: '#008F76' }} width={112}>
        <Text color="inherit" variant="body" sx={{ fontWeight: 'strong' }}>
          SEP 8 - OCT 7
        </Text>
      </Flex>
      <Flex
        py={2}
        pl={4}
        alignItems="center"
        bg="#25303B"
        sx={{
          borderRadius: 'circle',
        }}
      >
        <Text color="white" variant="bodyLarge">
          Ends in
        </Text>
        <Countdown
          ml={1}
          variant="bodyLarge"
          color="primaryText"
          fallback="0h 0m 0s"
          timestamp={COMPETITION_SEASONS_CONFIG[0].endTimestamp}
        />
      </Flex>
    </Flex>
  )
}

export default CompetitionBannerCountdown

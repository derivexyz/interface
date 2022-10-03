import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { MarginProps, SxProps } from '@lyra/ui/types'
import React from 'react'

type Props = SxProps & MarginProps

const CompetitionBannerPrizesLabel = ({ sx, ...marginProps }: Props) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      width={300}
      bg="white"
      sx={{
        color: '#25303B',
        borderRadius: 'circle',
        ...sx,
      }}
      {...marginProps}
    >
      <Text color="inherit" variant="heading" sx={{ fontWeight: 700 }}>
        40,000 OP IN PRIZES
      </Text>
    </Flex>
  )
}

export default CompetitionBannerPrizesLabel

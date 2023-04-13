import Box from '@lyra/ui/components/Box'
import { CardElement } from '@lyra/ui/components/Card'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import RewardsReferralsCard from './RewardsReferralsCard'

type Props = MarginProps

const RewardsReferralsSection = ({ ...marginProps }: Props): CardElement => {
  return (
    <Flex flexDirection="column" mt={[6, 4]}>
      <Flex alignItems="center" px={[6, 0]} mb={5}>
        <Box>
          <Text mb={2} variant="title">
            Referrals
          </Text>
          <Text color="secondaryText">Earn rewards for providing referring traders.</Text>
        </Box>
      </Flex>
      <Flex flexDirection="column">
        <RewardsReferralsCard />
      </Flex>
    </Flex>
  )
}

export default RewardsReferralsSection

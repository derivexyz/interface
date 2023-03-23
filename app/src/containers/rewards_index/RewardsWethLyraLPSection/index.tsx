import Box from '@lyra/ui/components/Box'
import { CardElement } from '@lyra/ui/components/Card'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'

import { CamelotStaking } from '@/app/utils/fetchCamelotStaking'
import { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'

import RewardsArrakisCard from './RewardsArrakisCard'
import RewardsCamelotCard from './RewardsCamelotCard'

type Props = {
  arrakisStaking: ArrakisStaking | null
  camelotStaking: CamelotStaking | null
} & MarginProps

const RewardsWethLyraLPSection = ({ arrakisStaking, camelotStaking, ...marginProps }: Props): CardElement => {
  return (
    <Flex flexDirection="column" mt={[6, 0]}>
      <Box px={[6, 0]} mb={5}>
        <Text mb={2} variant="title">
          ETH-LYRA LP
        </Text>
        <Text color="secondaryText">Earn rewards on the Uniswap v3 pool via Arrakis Finance and Camelot DEX.</Text>
      </Box>
      <Flex flexDirection="column" {...marginProps}>
        <RewardsArrakisCard arrakisStaking={arrakisStaking} />
        <RewardsCamelotCard camelotStaking={camelotStaking} mt={4} />
      </Flex>
    </Flex>
  )
}

export default RewardsWethLyraLPSection

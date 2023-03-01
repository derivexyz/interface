import Box from '@lyra/ui/components/Box'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import { PageId } from '@/app/constants/pages'
import getPagePath from '@/app/utils/getPagePath'

import RewardsTokenSupplyCard from '../RewardsTokenSupplyCard'

type Props = {
  showBackButton?: boolean
}
export default function RewardPageHeader({ showBackButton = true }: Props) {
  return (
    <Box mb={4} p={[6, 0]}>
      <Grid sx={{ gridTemplateColumns: ['1fr', '1fr auto'], alignItems: 'center' }}>
        <Box>
          <Text variant="xlTitle" mb={2}>
            Rewards
          </Text>
          <Text variant="heading" color="secondaryText" sx={{ fontWeight: 300 }}>
            Stake and Earn
          </Text>
        </Box>
        <RewardsTokenSupplyCard mt={[56, 0]} />
      </Grid>
      {showBackButton ? (
        <Flex>
          <IconButton icon={IconType.ArrowLeft} href={getPagePath({ page: PageId.RewardsIndex })} />
        </Flex>
      ) : null}
    </Box>
  )
}

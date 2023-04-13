import Box from '@lyra/ui/components/Box'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React from 'react'

import { PageId } from '@/app/constants/pages'
import { ReferralsPageData } from '@/app/hooks/referrals/useReferralsPageData'
import getPagePath from '@/app/utils/getPagePath'

import ReferralsHeaderCard from '../ReferralsHeaderCard'

type Props = {
  data: ReferralsPageData
  showBackButton?: boolean
}

export default function ReferralsPageHeader({ data, showBackButton = true }: Props) {
  const isMobile = useIsMobile()
  return (
    <Box mb={4} p={[6, 0]}>
      <Grid sx={{ gridTemplateColumns: ['1fr', '1fr auto'], alignItems: 'center' }}>
        <Box>
          <Text variant="xlTitle" mb={2}>
            Rewards
          </Text>
          <Text variant="heading" color="secondaryText" sx={{ fontWeight: 'light' }}>
            Stake, deposit and refer
          </Text>
        </Box>
        {!isMobile ? <ReferralsHeaderCard data={data} mt={[56, 0]} /> : null}
      </Grid>
      {showBackButton ? (
        <Flex>
          <IconButton icon={IconType.ArrowLeft} href={getPagePath({ page: PageId.RewardsIndex })} />
        </Flex>
      ) : null}
    </Box>
  )
}

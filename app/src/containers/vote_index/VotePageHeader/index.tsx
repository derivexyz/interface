import IconButton from '@lyra/ui/components/Button/IconButton'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React from 'react'

import { PageId } from '@/app/constants/pages'
import getPagePath from '@/app/utils/getPagePath'

import RewardsTokenSupplyCard from '../../rewards/RewardsPageHeader/RewardsTokenSupplyCard'

type Props = {
  showBackButton?: boolean
}
export default function VotePageHeader({ showBackButton = false }: Props) {
  const isMobile = useIsMobile()
  return (
    <Flex mb={[0, 4]} p={[6, 0]} flexDirection="column">
      <Grid sx={{ gridTemplateColumns: ['1fr', '1fr auto'], alignItems: 'center' }}>
        <Flex flexDirection="column">
          <Text variant="xlTitle" mb={2}>
            Vote
          </Text>
          <Text variant="heading" color="secondaryText" sx={{ fontWeight: 300 }}>
            Participate in governance
          </Text>
        </Flex>
        {!isMobile ? <RewardsTokenSupplyCard mt={[56, 0]} /> : null}
      </Grid>
      {showBackButton ? (
        <Flex mt={8}>
          <IconButton icon={IconType.ArrowLeft} href={getPagePath({ page: PageId.VoteIndex })} />
        </Flex>
      ) : null}
    </Flex>
  )
}

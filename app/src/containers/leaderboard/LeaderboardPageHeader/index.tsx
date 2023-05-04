import Box from '@lyra/ui/components/Box'
import IconButton from '@lyra/ui/components/Button/IconButton'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { AccountRewardEpoch, GlobalRewardEpoch } from '@lyrafinance/lyra-js'
import React from 'react'

import { PageId } from '@/app/constants/pages'
import useNetwork from '@/app/hooks/account/useNetwork'
import useWallet from '@/app/hooks/account/useWallet'
import getPagePath from '@/app/utils/getPagePath'

import LeaderboardHeaderCard from '../LeaderboardHeaderCard'

type Props = {
  latestAccountRewardEpoch?: AccountRewardEpoch
  latestGlobalRewardEpoch: GlobalRewardEpoch
  showBackButton?: boolean
  showHistoryButton?: boolean
}

export default function LeaderboardPageHeader({
  latestGlobalRewardEpoch,
  latestAccountRewardEpoch,
  showBackButton = true,
  showHistoryButton = true,
}: Props) {
  const isMobile = useIsMobile()
  const { isConnected } = useWallet()
  const network = useNetwork()
  return (
    <Box mb={4} p={[6, 0]}>
      <Grid sx={{ gridTemplateColumns: ['1fr', '1fr auto'], alignItems: 'center' }}>
        <Box>
          <Text variant="xlTitle" mb={2}>
            Airdrop
          </Text>
          <Text variant="heading" color="secondaryText" sx={{ fontWeight: 'light' }}>
            Earn ARB and OP trading rewards
          </Text>
        </Box>
        {!isMobile && isConnected ? (
          <LeaderboardHeaderCard
            latestAccountRewardEpoch={latestAccountRewardEpoch}
            latestGlobalRewardEpoch={latestGlobalRewardEpoch}
            showHistoryButton={showHistoryButton}
            mt={[56, 0]}
          />
        ) : null}
      </Grid>
      {showBackButton ? (
        <Flex mt={8}>
          <IconButton icon={IconType.ArrowLeft} href={getPagePath({ page: PageId.Leaderboard, network })} />
        </Flex>
      ) : null}
    </Box>
  )
}

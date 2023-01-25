import Alert from '@lyra/ui/components/Alert'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import formatDuration from '@lyra/ui/utils/formatDuration'
import React from 'react'

import { SECONDS_IN_HOUR } from '@/app/constants/time'
import useNetwork from '@/app/hooks/account/useNetwork'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLatestRewardEpoch from '@/app/hooks/rewards/useLatestRewardEpoch'

const RewardsLastUpdatedAlert = withSuspense(() => {
  const network = useNetwork()
  const epochs = useLatestRewardEpoch(network)
  const currentTimestamp = epochs?.global.blockTimestamp ?? 0
  const lastUpdatedTimestamp = epochs?.global.lastUpdatedTimestamp ?? 0
  const lastUpdatedDuration = currentTimestamp - lastUpdatedTimestamp
  if (lastUpdatedDuration > SECONDS_IN_HOUR) {
    return (
      <Flex ml={6}>
        <Alert
          title="Warning"
          icon={IconType.AlertTriangle}
          description={`Rewards were last updated ${formatDuration(lastUpdatedDuration)} ago and may be outdated.`}
          variant="warning"
        />
      </Flex>
    )
  } else {
    return null
  }
})

export default RewardsLastUpdatedAlert

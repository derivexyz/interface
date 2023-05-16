import Alert from '@lyra/ui/components/Alert'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import formatDuration from '@lyra/ui/utils/formatDuration'
import React from 'react'

import { SECONDS_IN_HOUR } from '@/app/constants/time'
import useNetwork from '@/app/hooks/account/useNetwork'
import { LatestRewardEpoch } from '@/app/hooks/rewards/useRewardsPageData'

type Props = {
  latestRewardEpochs: LatestRewardEpoch[]
}

const RewardsLastUpdatedAlert = ({ latestRewardEpochs }: Props) => {
  const network = useNetwork()
  const latestRewardEpoch = latestRewardEpochs.find(epochs => epochs.global.lyra.network === network)
  const currentTimestamp = latestRewardEpoch?.global.blockTimestamp ?? 0
  const lastUpdatedTimestamp = latestRewardEpoch?.global.lastUpdatedTimestamp ?? 0
  const lastUpdatedDuration = currentTimestamp - lastUpdatedTimestamp
  if (lastUpdatedDuration <= SECONDS_IN_HOUR) {
    return null
  }
  return (
    <Flex>
      <Alert
        title="Warning"
        icon={IconType.AlertTriangle}
        description={`Rewards were last updated ${formatDuration(lastUpdatedDuration)} ago and may be outdated.`}
        variant="warning"
      />
    </Flex>
  )
}

export default RewardsLastUpdatedAlert

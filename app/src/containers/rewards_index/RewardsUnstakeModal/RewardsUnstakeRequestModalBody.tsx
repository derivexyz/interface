import Alert from '@lyra/ui/components/Alert'
import { IconType } from '@lyra/ui/components/Icon'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import { MarginProps } from '@lyra/ui/types'
import { LayoutProps } from '@lyra/ui/types'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React from 'react'

import RowItem from '@/app/components/common/RowItem'
import { AppNetwork } from '@/app/constants/networks'
import { LyraBalances } from '@/app/utils/common/fetchLyraBalances'
import { getStkLyraBalanceForNetwork } from '@/app/utils/common/getLyraBalanceForNetwork'
import { LyraStaking } from '@/app/utils/rewards/fetchLyraStaking'

import RewardsUnstakeModalButton from './RewardsUnstakeModalButton'

type Props = {
  lyraBalances: LyraBalances
  lyraStaking: LyraStaking
} & LayoutProps &
  MarginProps

const RewardsUnstakeRequestModalBody = ({ lyraStaking, lyraBalances, ...styleProps }: Props) => {
  return (
    <ModalBody {...styleProps}>
      <Text color="secondaryText" width="100%" mb={10}>
        {lyraStaking?.isInCooldown
          ? `After the cooldown period, you will be able to complete the process and add unstaked LYRA to your wallet.`
          : 'Requesting to unstake begins the 14 day cooldown period. After the cooldown period, you will be able to complete the process and add unstaked LYRA to your wallet.'}
      </Text>
      <RowItem
        mb={6}
        label="Staked Balance"
        value={<Text>{formatNumber(getStkLyraBalanceForNetwork(lyraBalances, AppNetwork.Ethereum))} stkLYRA</Text>}
      />
      <RowItem
        mb={8}
        label="Cooldown Period"
        value={<Countdown timestamp={lyraStaking?.unstakeWindowStartTimestamp ?? 0} fallback="14d" ml="auto" />}
      />
      <Alert
        mb={3}
        variant="warning"
        title="Warning"
        icon={IconType.AlertTriangle}
        description={
          'After the 14 day unstaking period you have a 2 day window to unstake your LYRA. If you miss this window you have to wait another 14 days.'
        }
      />
      <RewardsUnstakeModalButton lyraBalances={lyraBalances} lyraStaking={lyraStaking} />
    </ModalBody>
  )
}

export default RewardsUnstakeRequestModalBody

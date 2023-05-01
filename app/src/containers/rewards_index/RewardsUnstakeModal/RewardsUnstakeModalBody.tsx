import { BigNumber } from '@ethersproject/bignumber'
import Flex from '@lyra/ui/components/Flex'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { GlobalRewardEpoch } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import RowItem from '@/app/components/common/RowItem'
import { ZERO_BN } from '@/app/constants/bn'
import { AppNetwork } from '@/app/constants/networks'
import { LyraBalances } from '@/app/utils/common/fetchLyraBalances'
import { getLyraBalanceForNetwork, getStkLyraBalanceForNetwork } from '@/app/utils/common/getLyraBalanceForNetwork'
import { LyraStaking } from '@/app/utils/rewards/fetchLyraStaking'
import toBigNumber from '@/app/utils/toBigNumber'

import RewardsUnstakeModalButton from './RewardsUnstakeModalButton'

type Props = {
  globalRewardEpoch: GlobalRewardEpoch
  lyraBalances: LyraBalances
  lyraStaking: LyraStaking
  onClose: () => void
}

const UnstakeModalBody = ({ lyraBalances, lyraStaking, globalRewardEpoch, onClose }: Props) => {
  const [amount, setAmount] = useState<BigNumber>(ZERO_BN)
  const maxStakeBalance = getLyraBalanceForNetwork(lyraBalances, AppNetwork.Ethereum)
  const currentTimestamp = globalRewardEpoch.blockTimestamp
  const unstakeWindowEndTimestamp = lyraStaking?.unstakeWindowEndTimestamp ?? 0
  return (
    <ModalBody>
      <Text variant="body" color="secondaryText" width="100%" mb={10}>
        Your staked LYRA can now be unstaked. If you do not unstake within 2 days, the staking period resets and you'll
        have to wait 14 days.
      </Text>
      <RowItem
        mb={6}
        textVariant="body"
        label="Amount to Unstake"
        value={
          <BigNumberInput
            ml="auto"
            mr={-3}
            width={150}
            value={amount}
            onChange={newAmount => setAmount(newAmount)}
            placeholder={ZERO_BN}
            max={toBigNumber(maxStakeBalance) ?? ZERO_BN}
            min={ZERO_BN}
            textAlign="right"
            showMaxButton
          />
        }
      />
      <RowItem
        mb={8}
        textVariant="body"
        label="Staked Balance"
        value={<Text>{formatNumber(getStkLyraBalanceForNetwork(lyraBalances, AppNetwork.Ethereum))} stkLYRA</Text>}
      />
      <RowItem textVariant="body" mb={7} label="Cooldown Period" value={'Complete'} />
      {unstakeWindowEndTimestamp > currentTimestamp ? (
        <Flex width="100%" mb={8} alignItems="center" justifyContent="space-between">
          <Text variant="body" color="secondaryText">
            Unstake Period
          </Text>
          <Countdown timestamp={unstakeWindowEndTimestamp} showSeconds fallback="Less than 2 days" ml="auto" />
        </Flex>
      ) : null}
      <RewardsUnstakeModalButton
        lyraBalances={lyraBalances}
        lyraStaking={lyraStaking}
        amount={amount}
        onClose={onClose}
      />
    </ModalBody>
  )
}

export default UnstakeModalBody

import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { AccountLyraBalances, GlobalRewardEpoch } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'
import React from 'react'
import { useMemo, useState } from 'react'

import RowItem from '@/app/components/common/RowItem'
import { TradingBoostTable } from '@/app/components/rewards/TradingBoostTable'
import { ZERO_BN } from '@/app/constants/bn'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { TradingRewardsTrader } from '@/app/hooks/leaderboard/useLeaderboardPageData'
import fromBigNumber from '@/app/utils/fromBigNumber'

import RewardsStakeFormAmountInput from '../../rewards_index/RewardsStakeModal/RewardsStakeFormAmountInput'
import StakeFormButton from '../../rewards_index/RewardsStakeModal/RewardsStakeFormButton'

type Props = {
  latestGlobalRewardEpoch: GlobalRewardEpoch
  leaderboard: TradingRewardsTrader[]
  lyraBalances: AccountLyraBalances
  isOpen: boolean
  onClose: () => void
}

export default function LeaderboardBoostModal({
  leaderboard,
  latestGlobalRewardEpoch,
  isOpen,
  onClose,
  lyraBalances,
}: Props) {
  const [amount, setAmount] = useState<BigNumber>(ZERO_BN)
  const account = useWalletAccount()
  const maxStakeBalance = lyraBalances.ethereumLyra
  const boost: number = useMemo(() => {
    let boost = 1
    const trader = leaderboard.find(trader => trader.trader.toLowerCase() === account?.toLowerCase())
    const inputAmount = fromBigNumber(amount)
    const amountBoost: number =
      inputAmount >= 250000
        ? 2.5
        : inputAmount >= 50000
        ? 2
        : inputAmount >= 10000
        ? 1.5
        : inputAmount >= 1000
        ? 1.2
        : 1
    if (trader?.boost) {
      boost = Math.max(trader?.boost ?? 1, boost)
    }
    return Math.max(boost, amountBoost)
  }, [account, amount, leaderboard])
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={<Text variant="heading">Boost</Text>}>
      <ModalBody>
        <Text color="secondaryText" mb={10}>
          Get boosts on your daily trading rewards by staking LYRA, being an active trader, or being referred by another
          trader.
        </Text>
        <RowItem
          mb={8}
          label="Amount to Stake"
          value={
            <RewardsStakeFormAmountInput
              ml="auto"
              amount={amount}
              onChangeAmount={newAmount => setAmount(newAmount)}
              max={maxStakeBalance}
            />
          }
        />
        <RowItem mb={8} label="Balance" value={`${formatNumber(lyraBalances.ethereumLyra)} LYRA`} />
        <TradingBoostTable
          latestGlobalRewardEpoch={latestGlobalRewardEpoch}
          maxHeight={245}
          sx={{ overflow: 'scroll' }}
          boost={boost}
        />
        <StakeFormButton mt={6} amount={amount} onClose={onClose} />
      </ModalBody>
    </Modal>
  )
}

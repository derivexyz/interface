import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Center from '@lyra/ui/components/Center'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Modal from '@lyra/ui/components/Modal'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { Market } from '@lyrafinance/lyra-js'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import StakeFormButton from '@/app/containers/rewards/StakeCardBody/StakeCardBodyButton'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLyraAccountStaking from '@/app/hooks/rewards/useLyraAccountStaking'
import useVaultBalance from '@/app/hooks/vaults/useVaultBalance'
import fromBigNumber from '@/app/utils/fromBigNumber'

import AmountUpdateText from '../../../components/common/AmountUpdateText'
import RowItem from '../../../components/common/RowItem'

type Props = {
  isOpen: boolean
  market: Market
  onClose: () => void
}

const VaultsBoostFormBody = withSuspense(
  ({ market, onClose }: Props) => {
    const vaultBalance = useVaultBalance(market)
    const lyraStaking = useLyraAccountStaking()
    const [amount, setAmount] = useState(ZERO_BN)

    if (!lyraStaking || !vaultBalance) {
      return null
    }

    const lyraBalance = lyraStaking.lyraBalances.ethereumLyra.add(lyraStaking.lyraBalances.optimismLyra)
    const stakedLyraBalance = lyraStaking.lyraBalances.ethereumStkLyra.add(lyraStaking.lyraBalances.optimismStkLyra)
    const newStakedLyraBalance = stakedLyraBalance.add(amount)
    const myApy =
      vaultBalance.globalRewardEpoch?.vaultApy(
        market.address,
        fromBigNumber(newStakedLyraBalance),
        fromBigNumber(vaultBalance.marketBalances.liquidityToken.balance)
      ) ?? vaultBalance.minApy

    return (
      <>
        <CardSection>
          <Text variant="secondary" color="secondaryText" width="100%" mb={6}>
            Stake LYRA to boost your {market.baseToken.symbol} Vault rewards. Staking boosts apply to all vaults.
          </Text>
          <RowItem mb={4} label="Stakeable Balance" value={formatBalance(lyraBalance, 'LYRA')} />
          <RowItem
            mb={4}
            label="Amount to Stake"
            value={
              <BigNumberInput
                width="50%"
                value={amount}
                onChange={setAmount}
                max={lyraBalance}
                textAlign="right"
                showMaxButton
              />
            }
          />
          {stakedLyraBalance.gt(0) ? (
            <RowItem
              label="Staked Balance"
              value={
                <AmountUpdateText
                  variant="secondary"
                  prevAmount={stakedLyraBalance}
                  newAmount={newStakedLyraBalance}
                  symbol="stkLYRA"
                />
              }
            />
          ) : null}
        </CardSection>
        <CardSeparator />
        <CardSection>
          <RowItem
            mb={4}
            label="APY Range"
            value={`${formatPercentage(vaultBalance.minApy.total, true)} - ${formatPercentage(
              vaultBalance.maxApy.total,
              true
            )}`}
          />
          <RowItem
            mb={6}
            label="Your APY"
            value={formatPercentage(myApy.total, true)}
            valueColor={
              vaultBalance.minApy.total > 0 && myApy.total > vaultBalance.minApy.total ? 'primaryText' : 'text'
            }
          />
          <StakeFormButton amount={amount} onClose={onClose} />
        </CardSection>
      </>
    )
  },
  () => (
    <CardSection height={380}>
      <Center width="100%" height="100%">
        <Spinner />
      </Center>
    </CardSection>
  )
)

export default function VaultsBoostFormModal({ isOpen, onClose, market }: Props) {
  return (
    <Modal isMobileFullscreen title="Boost APY" isOpen={isOpen} onClose={onClose}>
      <VaultsBoostFormBody market={market} isOpen={isOpen} onClose={onClose} />
    </Modal>
  )
}

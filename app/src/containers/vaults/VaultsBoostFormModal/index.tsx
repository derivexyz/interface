import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Modal from '@lyra/ui/components/Modal'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React, { useState } from 'react'

import AmountUpdateText from '@/app/components/common/AmountUpdateText'
import { ZERO_BN } from '@/app/constants/bn'
import { AppNetwork } from '@/app/constants/networks'
import { Vault } from '@/app/constants/vault'
import { getLyraBalanceForNetwork } from '@/app/utils/common/getLyraBalanceForNetwork'
import formatAPY from '@/app/utils/formatAPY'
import formatAPYRange from '@/app/utils/formatAPYRange'
import fromBigNumber from '@/app/utils/fromBigNumber'
import toBigNumber from '@/app/utils/toBigNumber'

import RowItem from '../../../components/common/RowItem'
import StakeFormButton from '../../earn_index/RewardsStakeModal/RewardsStakeFormButton'

type Props = {
  isOpen: boolean
  vault: Vault
  onClose: () => void
}

const VaultsBoostFormBody = ({ vault, onClose }: Props) => {
  const { market, lyraBalances, marketBalances } = vault
  const [amount, setAmount] = useState(ZERO_BN)
  const amountNum = fromBigNumber(amount)
  const lyraBalance = getLyraBalanceForNetwork(lyraBalances, AppNetwork.Ethereum)
  const stakedLyraBalance = lyraBalances.totalStkLyra.amount
  const newStakedLyraBalance = stakedLyraBalance + amountNum
  const totalApy = vault.apy.reduce((total, token) => total + token.amount, 0)
  const minTotalApy = vault.minApy.reduce((total, token) => total + token.amount, 0)

  const newTotalApy =
    vault.globalRewardEpoch?.vaultApy(
      market.address,
      newStakedLyraBalance,
      fromBigNumber(marketBalances.liquidityToken.balance)
    ) ?? []

  const newApyMultiplier =
    vault.globalRewardEpoch?.vaultApyMultiplier(
      market.address,
      newStakedLyraBalance,
      fromBigNumber(marketBalances.liquidityToken.balance)
    ) ?? 1

  return (
    <>
      <CardSection>
        <Text color="secondaryText" width="100%" mb={6}>
          Stake LYRA to boost your {market.baseToken.symbol} Vault rewards. Staking boosts apply to all vaults.
        </Text>
        <RowItem
          mb={4}
          label="Amount to Stake"
          value={
            <BigNumberInput
              width="50%"
              value={amount}
              onChange={setAmount}
              max={toBigNumber(lyraBalance)}
              textAlign="right"
              showMaxButton
            />
          }
        />
        <RowItem
          label="Balance"
          value={
            <AmountUpdateText
              prevAmount={lyraBalance}
              newAmount={lyraBalance > amountNum ? lyraBalance - amountNum : ZERO_BN}
              symbol="LYRA"
            />
          }
        />
      </CardSection>
      <CardSeparator />
      <CardSection>
        <RowItem mb={4} label="APY Range" value={`${formatAPYRange(vault.minApy, vault.maxApy)}`} />
        <RowItem
          mb={6}
          label="Your APY"
          value={`${formatAPY(newTotalApy, { showSymbol: false })}${
            newApyMultiplier > 1.01 ? ` (${formatNumber(newApyMultiplier)}x)` : ''
          }`}
          valueColor={minTotalApy > 0 && totalApy > minTotalApy * 1.01 ? 'primaryText' : 'text'}
        />
        <StakeFormButton amount={amount} onClose={onClose} />
      </CardSection>
    </>
  )
}

export default function VaultsBoostFormModal({ isOpen, onClose, vault }: Props) {
  return (
    <Modal title="Boost APY" isOpen={isOpen} onClose={onClose}>
      <VaultsBoostFormBody vault={vault} isOpen={isOpen} onClose={onClose} />
    </Modal>
  )
}

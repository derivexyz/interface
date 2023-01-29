import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Modal from '@lyra/ui/components/Modal'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React, { useState } from 'react'

import AmountUpdateText from '@/app/components/common/AmountUpdateText'
import { ZERO_BN } from '@/app/constants/bn'
import { Vault } from '@/app/constants/vault'
import StakeFormButton from '@/app/containers/rewards/StakeCardBody/StakeCardBodyButton'
import formatAPY from '@/app/utils/formatAPY'
import formatAPYRange from '@/app/utils/formatAPYRange'
import fromBigNumber from '@/app/utils/fromBigNumber'

import RowItem from '../../../components/common/RowItem'

type Props = {
  isOpen: boolean
  vault: Vault
  onClose: () => void
}

const VaultsBoostFormBody = ({ vault, onClose }: Props) => {
  const { market, lyraBalances, marketBalances } = vault
  const [amount, setAmount] = useState(ZERO_BN)

  const lyraBalance = lyraBalances.ethereumLyra
  const stakedLyraBalance = lyraBalances.ethereumStkLyra.add(lyraBalances.optimismStkLyra)
  const newStakedLyraBalance = stakedLyraBalance.add(amount)
  const totalApy = vault.apy.reduce((total, token) => total + token.amount, 0)
  const minTotalApy = vault.minApy.reduce((total, token) => total + token.amount, 0)

  const newTotalApy =
    vault.globalRewardEpoch?.vaultApy(
      market.address,
      fromBigNumber(newStakedLyraBalance),
      fromBigNumber(marketBalances.liquidityToken.balance)
    ) ?? []

  const newApyMultiplier =
    vault.globalRewardEpoch?.vaultApyMultiplier(
      market.address,
      fromBigNumber(newStakedLyraBalance),
      fromBigNumber(marketBalances.liquidityToken.balance)
    ) ?? 1

  return (
    <>
      <CardSection>
        <Text variant="secondary" color="secondaryText" width="100%" mb={6}>
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
              max={lyraBalance}
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
              newAmount={lyraBalance.gt(amount) ? lyraBalance.sub(amount) : ZERO_BN}
              symbol="LYRA"
              variant="secondary"
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
          valueColor={minTotalApy > 0 && totalApy > minTotalApy ? 'primaryText' : 'text'}
        />
        <StakeFormButton amount={amount} onClose={onClose} />
      </CardSection>
    </>
  )
}

export default function VaultsBoostFormModal({ isOpen, onClose, vault }: Props) {
  return (
    <Modal isMobileFullscreen title="Boost APY" isOpen={isOpen} onClose={onClose}>
      <VaultsBoostFormBody vault={vault} isOpen={isOpen} onClose={onClose} />
    </Modal>
  )
}

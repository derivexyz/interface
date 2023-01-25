import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Modal from '@lyra/ui/components/Modal'
import Text from '@lyra/ui/components/Text'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import React, { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { Vault } from '@/app/constants/vault'
import StakeFormButton from '@/app/containers/rewards/StakeCardBody/StakeCardBodyButton'
import fromBigNumber from '@/app/utils/fromBigNumber'

import AmountUpdateText from '../../../components/common/AmountUpdateText'
import RowItem from '../../../components/common/RowItem'

type Props = {
  isOpen: boolean
  vault: Vault
  onClose: () => void
}

const VaultsBoostFormBody = ({ vault, onClose }: Props) => {
  const { market, lyraBalances } = vault
  const [amount, setAmount] = useState(ZERO_BN)

  const lyraBalance = lyraBalances.ethereumLyra.add(lyraBalances.optimismLyra)
  const stakedLyraBalance = lyraBalances.ethereumStkLyra.add(lyraBalances.optimismStkLyra)
  const newStakedLyraBalance = stakedLyraBalance.add(amount)
  const myApy =
    vault.globalRewardEpoch?.vaultApy(
      market.address,
      fromBigNumber(newStakedLyraBalance),
      fromBigNumber(vault.marketBalances.liquidityToken.balance)
    ) ?? vault.minApy

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
          value={`${formatPercentage(vault.minApy.total, true)} - ${formatPercentage(vault.maxApy.total, true)}`}
        />
        <RowItem
          mb={6}
          label="Your APY"
          value={formatPercentage(myApy.total, true)}
          valueColor={vault.minApy.total > 0 && myApy.total > vault.minApy.total ? 'primaryText' : 'text'}
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

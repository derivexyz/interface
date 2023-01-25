import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React, { useCallback, useState } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import VaultsPendingDepositsTableOrList from '@/app/components/common/VaultsPendingDepositsTableOrList'
import VaultsPendingWithdrawalsTableOrList from '@/app/components/common/VaultsPendingWithdrawalsTableOrList'
import { IGNORE_VAULTS_LIST } from '@/app/constants/ignore'
import { Vault } from '@/app/constants/vault'
import VaultsBoostFormModal from '@/app/containers/vaults/VaultsBoostFormModal'

import VaultsDepositFormModal from '../VaultsDepositFormModal'
import VaultsWithdrawFormModal from '../VaultsWithdrawFormModal'

type Props = {
  vault: Vault
}

const VaultsMyLiquidityCard = ({ vault }: Props) => {
  const [isDepositOpen, setDepositModalOpen] = useState(false)
  const [isWithdrawOpen, setWithdrawModalOpen] = useState(false)
  const [isBoostOpen, setBoostModalOpen] = useState(false)
  const onDepositClose = useCallback(() => setDepositModalOpen(false), [])
  const onWithdrawClose = useCallback(() => setWithdrawModalOpen(false), [])
  const onBoostClose = useCallback(() => setBoostModalOpen(false), [])

  // Check for max boost with 1% buffer
  const isMaxBoost = vault.maxApy.total > 0 && vault.apy.total * 1.01 > vault.maxApy.total

  const { market } = vault

  return (
    <Card>
      <CardSection>
        <Box mb={[3, 6]}>
          <Text variant="heading">Your Liquidity</Text>
          <Text variant="heading">{formatUSD(vault.liquidityTokenBalanceValue)}</Text>
        </Box>
        <Grid mb={[3, 6]} sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr'], gridColumnGap: 6, gridRowGap: 6 }}>
          <LabelItem label="Balance" value={formatBalance(vault.liquidityToken.balance, vault.liquidityToken.symbol)} />
          <LabelItem
            label="Your APY"
            valueColor={isMaxBoost ? 'primaryText' : 'text'}
            value={formatPercentage(vault.apy.total, true)}
          />
          {vault.minApy.total > 0 ? (
            <LabelItem
              label="APY Range"
              value={`${formatPercentage(vault.minApy.total, true)} - ${formatPercentage(vault.maxApy.total, true)}`}
            />
          ) : null}
        </Grid>
        <Grid sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr 1fr'], gridColumnGap: 6, gridRowGap: 6 }}>
          <Button
            onClick={() => setDepositModalOpen(true)}
            label="Deposit"
            variant="primary"
            size="lg"
            isDisabled={
              !!IGNORE_VAULTS_LIST.find(
                ({ marketName, chain }) => marketName === market.name && chain === market.lyra.chain
              )
            }
          />
          {vault.liquidityToken.balance.gt(0) ? (
            <Button
              onClick={() => setBoostModalOpen(true)}
              label={isMaxBoost ? 'Boosted' : 'Boost'}
              rightIcon={isMaxBoost ? IconType.Check : null}
              variant="primary"
              size="lg"
              isDisabled={
                !!IGNORE_VAULTS_LIST.find(
                  ({ marketName, chain }) => marketName === market.name && chain === market.lyra.chain
                ) || isMaxBoost
              }
            />
          ) : null}
          {vault.liquidityToken.balance.gt(0) ? (
            <Button onClick={() => setWithdrawModalOpen(true)} label="Withdraw" size="lg" />
          ) : null}
          <VaultsDepositFormModal isOpen={isDepositOpen} onClose={onDepositClose} vault={vault} />
          <VaultsWithdrawFormModal isOpen={isWithdrawOpen} onClose={onWithdrawClose} vault={vault} />
          <VaultsBoostFormModal isOpen={isBoostOpen} onClose={onBoostClose} vault={vault} />
        </Grid>
      </CardSection>
      {vault.pendingDeposits.length ? (
        <>
          <CardSeparator />
          <CardSection noPadding>
            <Text variant="heading" mx={6} mt={6}>
              Depositing
            </Text>
            <VaultsPendingDepositsTableOrList deposits={vault.pendingDeposits} />
          </CardSection>
        </>
      ) : null}
      {vault.pendingWithdrawals.length ? (
        <>
          <CardSeparator />
          <CardSection noPadding>
            <Text variant="heading" mx={6} mt={6}>
              Withdrawing
            </Text>
            <VaultsPendingWithdrawalsTableOrList withdrawals={vault.pendingWithdrawals} />
          </CardSection>
        </>
      ) : null}
    </Card>
  )
}

export default VaultsMyLiquidityCard

import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Version } from '@lyrafinance/lyra-js'
import React, { useCallback, useState } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import VaultsPendingDepositsTableOrList from '@/app/components/common/VaultsPendingDepositsTableOrList'
import VaultsPendingWithdrawalsTableOrList from '@/app/components/common/VaultsPendingWithdrawalsTableOrList'
import { IGNORE_VAULTS_LIST } from '@/app/constants/ignore'
import { Vault } from '@/app/constants/vault'
import VaultsBoostFormModal from '@/app/containers/vaults/VaultsBoostFormModal'
import formatAPY from '@/app/utils/formatAPY'
import formatAPYRange from '@/app/utils/formatAPYRange'

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
  const totalApy = vault.apy.reduce((total, token) => total + token.amount, 0)
  const minTotalApy = vault.minApy.reduce((total, token) => total + token.amount, 0)
  const maxTotalApy = vault.maxApy.reduce((total, token) => total + token.amount, 0)
  const isMaxBoost = maxTotalApy > 0 && totalApy * 1.01 > maxTotalApy

  const { market, globalRewardEpoch, apyMultiplier } = vault

  const isNew = globalRewardEpoch?.startTimestamp === 1676419200 && market.baseToken.symbol == 'WBTC'
  const isStartEarningInFuture =
    market.block.timestamp < (globalRewardEpoch?.startEarningTimestamp ?? 0) && market.baseToken.symbol === 'WBTC'
  return (
    <Card>
      <CardSection>
        <Box mb={[3, 6]}>
          <Text variant="cardHeading">Your Liquidity</Text>
          <Text variant="cardHeading">{formatUSD(vault.liquidityTokenBalanceValue)}</Text>
        </Box>
        <Grid mb={[3, 6]} sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr'], gridColumnGap: 6, gridRowGap: 6 }}>
          <LabelItem label="LP Balance" value={formatBalance(vault.liquidityToken)} />
          <LabelItem
            label="LP Profit / Loss"
            value={`${formatUSD(vault.pnl, { showSign: true })} (${formatPercentage(vault.pnlPercentage)})`}
            valueColor={vault.pnl >= 0 ? 'primaryText' : 'errorText'}
          />
          <LabelItem
            label="Your APY"
            valueColor={minTotalApy > 0 && totalApy > minTotalApy * 1.01 ? 'primaryText' : 'text'}
            value={`${formatAPY(vault.apy, { showSymbol: false, showEmptyDash: true })}${
              apyMultiplier > 1.01 ? ` (${formatNumber(apyMultiplier)}x)` : ''
            }`}
          />
          <LabelItem label="APY Range" value={formatAPYRange(vault.minApy, vault.maxApy, { showEmptyDash: true })} />
          {isNew && globalRewardEpoch.startEarningTimestamp && isStartEarningInFuture ? (
            <LabelItem
              label="Start Earning"
              value={<Countdown timestamp={globalRewardEpoch.startEarningTimestamp} showSeconds />}
            />
          ) : null}
        </Grid>
        <Grid my={2} sx={{ gridTemplateColumns: ['1fr', '1fr 1fr 1fr 1fr 1fr'], gridColumnGap: 6, gridRowGap: [3, 6] }}>
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
          {vault.market.lyra.version !== Version.Avalon ? (
            <Button
              onClick={() => setDepositModalOpen(true)}
              label="Deposit"
              variant={vault.liquidityToken.balance.gt(0) ? 'default' : 'primary'}
              size="lg"
              isDisabled={
                !!IGNORE_VAULTS_LIST.find(
                  ({ marketName, chain }) => marketName === market.name && chain === market.lyra.chain
                )
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
            <Text variant="cardHeading" mx={6} mt={6}>
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
            <Text variant="cardHeading" mx={6} mt={6}>
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

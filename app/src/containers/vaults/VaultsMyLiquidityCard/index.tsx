import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Center from '@lyra/ui/components/Center'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { Market } from '@lyrafinance/lyra-js'
import React, { useCallback, useState } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import VaultsPendingDepositsTableOrList from '@/app/components/common/VaultsPendingDepositsTableOrList'
import VaultsPendingWithdrawalsTableOrList from '@/app/components/common/VaultsPendingWithdrawalsTableOrList'
import { IGNORE_VAULTS_LIST } from '@/app/constants/ignore'
import VaultsBoostFormModal from '@/app/containers/vaults/VaultsBoostFormModal'
import withSuspense from '@/app/hooks/data/withSuspense'
import useVaultBalance from '@/app/hooks/vaults/useVaultBalance'

import VaultsDepositFormModal from '../VaultsDepositFormModal'
import VaultsWithdrawFormModal from '../VaultsWithdrawFormModal'

const MY_LIQUIDITY_CARD_HEIGHT = 350

type Props = {
  market: Market
}

const VaultsMyLiquidityCard = withSuspense(
  ({ market }: Props) => {
    const vaultBalance = useVaultBalance(market)

    if (!vaultBalance) {
      return null
    }

    const [isDepositOpen, setDepositModalOpen] = useState(false)
    const [isWithdrawOpen, setWithdrawModalOpen] = useState(false)
    const [isBoostOpen, setBoostModalOpen] = useState(false)
    const onDepositClose = useCallback(() => setDepositModalOpen(false), [])
    const onWithdrawClose = useCallback(() => setWithdrawModalOpen(false), [])
    const onBoostClose = useCallback(() => setBoostModalOpen(false), [])

    // Check for max boost with 1% buffer
    const isMaxBoost = vaultBalance.maxApy.total > 0 && vaultBalance.apy.total * 1.01 > vaultBalance.maxApy.total

    return (
      <Card>
        <CardSection>
          <Box mb={[3, 6]}>
            <Text variant="heading">Your Liquidity</Text>
            <Text variant="heading">{formatUSD(vaultBalance.liquidityTokenBalanceValue)}</Text>
          </Box>
          <Grid
            mb={[3, 6]}
            sx={{ gridTemplateColumns: ['1fr 1fr', '1fr 1fr 1fr 1fr'], gridColumnGap: 6, gridRowGap: 6 }}
          >
            <LabelItem
              label="Balance"
              value={formatBalance(vaultBalance.liquidityToken.balance, vaultBalance.liquidityToken.symbol)}
            />
            <LabelItem
              label="Your APY"
              value={vaultBalance.apy.total > 0 ? formatPercentage(vaultBalance.apy.total, true) : '-'}
            />
            <LabelItem
              label="APY Range"
              value={
                vaultBalance.minApy.total > 0
                  ? `${formatPercentage(vaultBalance.minApy.total, true)} - ${formatPercentage(
                      vaultBalance.maxApy.total,
                      true
                    )}`
                  : '-'
              }
            />
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
            {vaultBalance.liquidityToken.balance.gt(0) ? (
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
            {vaultBalance.liquidityToken.balance.gt(0) ? (
              <Button onClick={() => setWithdrawModalOpen(true)} label="Withdraw" size="lg" />
            ) : null}
            <VaultsDepositFormModal isOpen={isDepositOpen} onClose={onDepositClose} market={market} />
            <VaultsWithdrawFormModal isOpen={isWithdrawOpen} onClose={onWithdrawClose} market={market} />
            <VaultsBoostFormModal isOpen={isBoostOpen} onClose={onBoostClose} market={market} />
          </Grid>
        </CardSection>
        {vaultBalance.pendingDeposits.length ? (
          <>
            <CardSeparator />
            <CardSection noPadding>
              <Text variant="heading" mx={6} mt={6}>
                Depositing
              </Text>
              <VaultsPendingDepositsTableOrList deposits={vaultBalance.pendingDeposits} />
            </CardSection>
          </>
        ) : null}
        {vaultBalance.pendingWithdrawals.length ? (
          <>
            <CardSeparator />
            <CardSection noPadding>
              <Text variant="heading" mx={6} mt={6}>
                Withdrawing
              </Text>
              <VaultsPendingWithdrawalsTableOrList withdrawals={vaultBalance.pendingWithdrawals} />
            </CardSection>
          </>
        ) : null}
      </Card>
    )
  },
  () => (
    <Card height={MY_LIQUIDITY_CARD_HEIGHT}>
      <CardBody width="100%" height="100%">
        <Center height="100%">
          <Spinner />
        </Center>
      </CardBody>
    </Card>
  )
)

export default VaultsMyLiquidityCard

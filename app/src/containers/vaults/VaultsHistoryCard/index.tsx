import Box from '@lyra/ui/components/Box'
import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import ToggleButtonItem from '@lyra/ui/components/Button/ToggleButtonItem'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatDate from '@lyra/ui/utils/formatDate'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { AccountRewardEpoch, GlobalRewardEpoch } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'
import React, { useMemo, useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { SECONDS_IN_MONTH } from '@/app/constants/time'
import { Vault } from '@/app/constants/vault'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'

const MIN_COL_WIDTH = 150

const VAULT_HISTORY_TABS: { id: string; label: string }[] = [
  { id: 'rewards', label: 'Rewards' },
  { id: 'deposits', label: 'Deposits' },
]

type Props = {
  vault: Vault
  latestGlobalRewardEpoch: GlobalRewardEpoch
  accountRewardEpochs: AccountRewardEpoch[]
}

type DepositsWithdrawals = {
  timestamp: number
  action: string
  liquidity: BigNumber
}

const VaultsHistoryCard = ({ vault, latestGlobalRewardEpoch, accountRewardEpochs }: Props) => {
  const isMobile = useIsMobile()
  const account = useWalletAccount()
  const [selectedItem, setSelectedItem] = useState(VAULT_HISTORY_TABS[0].id)

  const market = vault.market
  const accountEpochsSorted = useMemo(
    () =>
      [...accountRewardEpochs]
        .filter(
          epoch =>
            epoch.lyra.version === market.lyra.version && !!epoch.vaultRewards(market.address).find(t => t.amount > 0)
        )
        .sort((a, b) => b.globalEpoch.distributionTimestamp - a.globalEpoch.distributionTimestamp),
    [market, accountRewardEpochs]
  )
  const depositsWithdrawalsSorted = useMemo(() => {
    const depositsWithdrawals: DepositsWithdrawals[] = []
    vault.allDeposits.forEach(deposit => {
      depositsWithdrawals.push({
        timestamp: deposit.depositTimestamp,
        action: 'Deposit',
        liquidity: deposit.value,
      })
    })
    vault.allWithdrawals.forEach(withdrawal => {
      depositsWithdrawals.push({
        timestamp: withdrawal.withdrawalTimestamp,
        action: 'Withdrawal',
        liquidity: withdrawal?.value ?? ZERO_BN,
      })
    })
    return depositsWithdrawals
  }, [vault.allDeposits, vault.allWithdrawals])

  const showRewards = selectedItem === 'rewards'
  const showDeposits = selectedItem === 'deposits'
  return (
    <Card>
      <CardBody>
        <Text mb={6} variant="cardHeading">
          History
        </Text>
        <Flex>
          <ToggleButton mt={4} mb={8}>
            {VAULT_HISTORY_TABS.map(item => (
              <ToggleButtonItem
                key={item.id}
                id={item.id}
                label={item.label}
                isSelected={selectedItem === item.id}
                onSelect={id => setSelectedItem(id)}
                width="100%"
                textVariant="body"
              />
            ))}
          </ToggleButton>
        </Flex>
        {showRewards ? (
          account && accountEpochsSorted.length > 0 && !latestGlobalRewardEpoch.isDepositPeriod ? (
            <Box overflowX="scroll">
              <Flex py={3}>
                <Text minWidth={MIN_COL_WIDTH} color="secondaryText">
                  Ended
                </Text>
                <Text minWidth={MIN_COL_WIDTH} color="secondaryText">
                  Your Liquidity
                </Text>
                <Text minWidth={MIN_COL_WIDTH} ml="auto" color="secondaryText" textAlign={isMobile ? 'left' : 'right'}>
                  Your Rewards
                </Text>
              </Flex>
              {accountEpochsSorted.map(accountEpoch => {
                const vaultRewards = accountEpoch.vaultRewards(market.address) ?? []
                const globalEpoch = accountEpoch.globalEpoch
                const isPendingDistribution =
                  globalEpoch.blockTimestamp > globalEpoch.endTimestamp &&
                  !accountEpoch.isVaultRewardsDistributed(market.address) &&
                  globalEpoch.blockTimestamp - globalEpoch.endTimestamp < SECONDS_IN_MONTH
                const isLateDistribution =
                  isPendingDistribution && globalEpoch.blockTimestamp > globalEpoch.distributionTimestamp

                return (
                  <Flex py={3} key={globalEpoch.id}>
                    <Text minWidth={MIN_COL_WIDTH}>{formatDate(globalEpoch.endTimestamp)}</Text>
                    <Text minWidth={MIN_COL_WIDTH}>
                      {formatBalance({
                        balance: accountEpoch?.vaultTokenBalance(market.address) ?? 0,
                        symbol: market.liquidityToken.symbol,
                        decimals: market.liquidityToken.decimals,
                      })}
                    </Text>
                    <Box minWidth={MIN_COL_WIDTH} ml="auto" textAlign={isMobile ? 'left' : 'right'}>
                      <Text>{vaultRewards.map(t => formatBalance(t)).join(', ')}</Text>
                      {isLateDistribution ? (
                        <Text variant="body" color="secondaryText">
                          Claiming delayed
                        </Text>
                      ) : isPendingDistribution ? (
                        <Text variant="body" color="secondaryText">
                          Claimable in&nbsp;
                          <Countdown as="span" timestamp={globalEpoch.distributionTimestamp} />
                        </Text>
                      ) : null}
                    </Box>
                  </Flex>
                )
              })}
            </Box>
          ) : (
            <Text color="secondaryText">No Rewards History</Text>
          )
        ) : null}
        {showDeposits ? (
          account && depositsWithdrawalsSorted.length > 0 ? (
            <Box overflowX="scroll">
              <Flex py={3}>
                <Text minWidth={MIN_COL_WIDTH} color="secondaryText">
                  Time
                </Text>
                <Text minWidth={MIN_COL_WIDTH} color="secondaryText">
                  Action
                </Text>
                <Text minWidth={MIN_COL_WIDTH} ml="auto" color="secondaryText" textAlign={isMobile ? 'left' : 'right'}>
                  Your Liquidity
                </Text>
              </Flex>
              {depositsWithdrawalsSorted.map((depositWithdrawal, idx) => {
                return (
                  <Flex py={3} key={idx}>
                    <Text minWidth={MIN_COL_WIDTH}>{formatDate(depositWithdrawal.timestamp)}</Text>
                    <Text minWidth={MIN_COL_WIDTH}>{depositWithdrawal.action}</Text>
                    <Text minWidth={MIN_COL_WIDTH} ml="auto" textAlign={isMobile ? 'left' : 'right'}>
                      {formatUSD(depositWithdrawal.liquidity)}
                    </Text>
                  </Flex>
                )
              })}
            </Box>
          ) : (
            <Text color="secondaryText">No Deposit History</Text>
          )
        ) : null}
      </CardBody>
    </Card>
  )
}

export default VaultsHistoryCard

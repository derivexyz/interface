import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatDate from '@lyra/ui/utils/formatDate'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { AccountRewardEpoch } from '@lyrafinance/lyra-js'
import { GlobalRewardEpoch } from '@lyrafinance/lyra-js'
import React from 'react'
import { useMemo } from 'react'
import { useState } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import RewardTokenAmounts from '@/app/components/rewards/RewardTokenAmounts'
import { PageId } from '@/app/constants/pages'
import { SECONDS_IN_MONTH } from '@/app/constants/time'
import { Vault } from '@/app/constants/vault'
import ConnectWalletButton from '@/app/containers/common/ConnectWalletButton'
import RewardsClaimModal from '@/app/containers/rewards/RewardsClaimModal'
import RewardsClaimModalButton from '@/app/containers/rewards/RewardsClaimModalButton'
import RewardPageHeader from '@/app/containers/rewards/RewardsPageHeader'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import formatAPY from '@/app/utils/formatAPY'
import formatAPYRange from '@/app/utils/formatAPYRange'
import formatTokenName from '@/app/utils/formatTokenName'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const CTA_BUTTON_WIDTH = 160
const MIN_COL_WIDTH = 150

type Props = {
  vault: Vault
  latestGlobalRewardEpoch: GlobalRewardEpoch
  accountRewardEpochs: AccountRewardEpoch[]
}

const RewardsVaultsPageHelper = ({ vault, latestGlobalRewardEpoch, accountRewardEpochs }: Props) => {
  const isMobile = useIsMobile()
  const account = useWalletAccount()
  const [isOpen, setIsOpen] = useState(false)

  const market = vault.market

  const latestAccountRewardEpoch = vault.accountRewardEpoch

  const vaultApy = vault.apy
  const minApy = vault.minApy
  const maxApy = vault.maxApy
  const vaultApyMultiplier = vault.apyMultiplier

  const emptyRewards = useMemo(
    () => latestGlobalRewardEpoch.vaultRewardTokens.map(t => ({ ...t, amount: 0 })),
    [latestGlobalRewardEpoch.vaultRewardTokens]
  )
  const pendingRewards = useMemo(() => {
    const pendingRewards = latestAccountRewardEpoch?.vaultRewards(market.address)
    return pendingRewards && pendingRewards.length ? pendingRewards : emptyRewards
  }, [emptyRewards, latestAccountRewardEpoch, market.address])
  const totalClaimableRewards = useMemo(() => {
    const totalClaimableRewards = latestAccountRewardEpoch?.totalClaimableVaultRewards(market.address)
    return totalClaimableRewards && totalClaimableRewards.length ? totalClaimableRewards : emptyRewards
  }, [emptyRewards, latestAccountRewardEpoch, market.address])

  const liquidityTokenBalanceValue = vault.liquidityTokenBalanceValue
  const tvl = vault.tvl

  const accountEpochsSorted = useMemo(
    () =>
      [...accountRewardEpochs]
        .filter(epoch => !!epoch.vaultRewards(market.address).find(t => t.amount > 0))
        .sort((a, b) => b.globalEpoch.distributionTimestamp - a.globalEpoch.distributionTimestamp),
    [market, accountRewardEpochs]
  )

  return (
    <Page header={!isMobile ? <RewardPageHeader /> : null} noHeaderPadding>
      <PageGrid>
        {isMobile ? <RewardPageHeader showBackButton={!isMobile} /> : null}
        <Flex mx={[6, 0]} mb={[6, 0]}>
          <Text variant="title">{formatTokenName(market.baseToken)} Vault</Text>
          <Text color="secondaryText" variant="title">
            &nbsp;·&nbsp;{getNetworkDisplayName(latestGlobalRewardEpoch.lyra.network)}
          </Text>
        </Flex>
        <Card>
          <CardSection>
            <Text variant="heading" mb={6}>
              Overview
            </Text>
            <Text color="secondaryText" mb={6}>
              This program rewards {formatTokenName(market.baseToken)} vault liquidity providers. Liquidity providers
              can stake LYRA to boost their rewards.
            </Text>
            <Grid sx={{ gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr' }}>
              <LabelItem textVariant="body" label="TVL" value={formatTruncatedUSD(tvl)} />
              <LabelItem
                textVariant="body"
                label="APY"
                value={formatAPYRange(minApy, maxApy, { showSymbol: false, showEmptyDash: true })}
              />
            </Grid>
          </CardSection>
          <CardSeparator isHorizontal />
          <CardSection isVertical sx={{ flexGrow: 1 }}>
            <Flex mb={8}>
              <Text variant="heading">Your Rewards</Text>
              <Text variant="heading" color="secondaryText">
                &nbsp; · &nbsp;{formatDate(latestGlobalRewardEpoch.startTimestamp, true)} -{' '}
                {formatDate(latestGlobalRewardEpoch.endTimestamp, true)}
              </Text>
            </Flex>
            {account ? (
              <>
                <Grid sx={{ gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', rowGap: 8 }}>
                  <LabelItem textVariant="body" label="Your Liquidity" value={formatUSD(liquidityTokenBalanceValue)} />
                  <LabelItem
                    textVariant="body"
                    label="Your APY"
                    value={`${formatAPY(vaultApy, {
                      showSymbol: false,
                      showEmptyDash: true,
                    })} ${
                      vaultApyMultiplier && vaultApyMultiplier > 1.01 ? `(${formatNumber(vaultApyMultiplier)}x)` : ''
                    }`}
                    valueColor={vaultApyMultiplier > 1.01 ? 'primaryText' : 'text'}
                  />
                  <LabelItem
                    textVariant="body"
                    label="Pending Rewards"
                    value={<RewardTokenAmounts tokenAmounts={pendingRewards} showDash={false} />}
                  />
                  <LabelItem
                    textVariant="body"
                    label="Ends In"
                    value={<Countdown timestamp={latestGlobalRewardEpoch.endTimestamp} />}
                    valueColor="primaryText"
                  />
                </Grid>
                {totalClaimableRewards.some(r => r.amount > 0) ? (
                  <LabelItem
                    mt={8}
                    label="Claimable Rewards"
                    value={<RewardTokenAmounts tokenAmounts={totalClaimableRewards} showDash={false} />}
                  />
                ) : null}
                <Flex mt={8}>
                  {totalClaimableRewards.some(r => r.amount > 0) ? (
                    <RewardsClaimModalButton
                      accountRewardEpoch={latestAccountRewardEpoch}
                      onClick={() => setIsOpen(true)}
                      minWidth={CTA_BUTTON_WIDTH}
                      mr={4}
                    />
                  ) : null}
                  <Button
                    label="Deposit"
                    href={getPagePath({
                      page: PageId.Vaults,
                      network: market.lyra.network,
                      marketAddressOrName: market.name,
                    })}
                    size="lg"
                    rightIcon={IconType.ArrowRight}
                    minWidth={CTA_BUTTON_WIDTH}
                  />
                </Flex>
              </>
            ) : (
              <Flex>
                <ConnectWalletButton
                  width={CTA_BUTTON_WIDTH}
                  size="lg"
                  network={latestGlobalRewardEpoch.lyra.network}
                />
              </Flex>
            )}
          </CardSection>
        </Card>
        {account && accountEpochsSorted.length > 0 ? (
          <Card>
            <CardBody noPadding>
              <Text mt={6} mb={4} mx={6} variant="heading">
                Epochs
              </Text>
              <Box px={6} overflowX="scroll">
                <Flex py={3}>
                  <Text minWidth={MIN_COL_WIDTH} color="secondaryText">
                    Ended
                  </Text>
                  <Text minWidth={MIN_COL_WIDTH} color="secondaryText">
                    Your Liquidity
                  </Text>
                  <Text
                    minWidth={MIN_COL_WIDTH}
                    ml="auto"
                    color="secondaryText"
                    textAlign={isMobile ? 'left' : 'right'}
                  >
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
                          <Text variant="secondary" color="secondaryText">
                            Claiming delayed
                          </Text>
                        ) : isPendingDistribution ? (
                          <Text variant="secondary" color="secondaryText">
                            Claimable in&nbsp;
                            <Countdown as="span" timestamp={globalEpoch.distributionTimestamp} />
                          </Text>
                        ) : null}
                      </Box>
                    </Flex>
                  )
                })}
              </Box>
            </CardBody>
          </Card>
        ) : null}
        {latestAccountRewardEpoch ? (
          <RewardsClaimModal
            accountRewardEpoch={latestAccountRewardEpoch}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        ) : null}
      </PageGrid>
    </Page>
  )
}

export default RewardsVaultsPageHelper

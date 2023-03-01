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
import formatDate from '@lyra/ui/utils/formatDate'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { AccountRewardEpoch, GlobalRewardEpoch, Market } from '@lyrafinance/lyra-js'
import React from 'react'
import { useMemo } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import RewardTokenAmounts from '@/app/components/rewards/RewardTokenAmounts'
import { UNIT, ZERO_BN } from '@/app/constants/bn'
import { REWARDS_HISTORY_GRID_COLUMN_TEMPLATE } from '@/app/constants/layout'
import { PageId } from '@/app/constants/pages'
import { CLAIMABLE_REWARDS_DELAY } from '@/app/constants/rewards'
import ConnectWalletButton from '@/app/containers/common/ConnectWalletButton'
import ClaimModal from '@/app/containers/rewards/ClaimModal'
import ClaimModalButton from '@/app/containers/rewards/ClaimModalButton'
import RewardPageHeader from '@/app/containers/rewards/RewardsPageHeader'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { LatestRewardEpoch } from '@/app/hooks/rewards/useLatestRewardEpoch'
import formatAPY from '@/app/utils/formatAPY'
import formatAPYRange from '@/app/utils/formatAPYRange'
import formatTokenName from '@/app/utils/formatTokenName'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const CTA_BUTTON_WIDTH = 160

type Props = {
  market: Market
  latestRewardEpoch: LatestRewardEpoch
  accountRewardEpochs: AccountRewardEpoch[]
  globalRewardEpochs: GlobalRewardEpoch[]
}

const RewardsVaultsPageHelper = ({ market, latestRewardEpoch, accountRewardEpochs, globalRewardEpochs }: Props) => {
  const isMobile = useIsMobile()
  const account = useWalletAccount()
  const [isOpen, setIsOpen] = useState(false)
  const { global: latestGlobalRewardEpoch, account: latestAccountRewardEpoch } = latestRewardEpoch
  const vaultApy = latestAccountRewardEpoch?.vaultApy(market.address) ?? []
  const minApy = latestGlobalRewardEpoch.minVaultApy(market.address)
  const maxApy = latestGlobalRewardEpoch.maxVaultApy(market.address)
  const vaultApyMultiplier = latestAccountRewardEpoch?.vaultApyMultiplier(market.address)

  const emptyVaultRewards = useMemo(
    () => latestGlobalRewardEpoch.totalVaultRewards(market.address).map(t => ({ ...t, amount: 0 })),
    [latestGlobalRewardEpoch, market]
  )
  const pendingRewards = latestAccountRewardEpoch?.vaultRewards(market.address) ?? emptyVaultRewards

  const { claimableVaultRewards, tvl, liquidityTokenBalanceValue } = useMemo(() => {
    const marketIndex = latestGlobalRewardEpoch.markets.findIndex(m => market.isEqual(m.address))
    const marketLiquidity = marketIndex >= 0 ? latestGlobalRewardEpoch.marketsLiquidity[marketIndex] : null
    const liquidityTokenBalance =
      latestAccountRewardEpoch?.vaultTokenBalances[market.baseToken.symbol].balance ?? ZERO_BN
    const liquidityTokenBalanceValue = marketLiquidity?.tokenPrice.mul(liquidityTokenBalance).div(UNIT) ?? ZERO_BN
    return {
      tvl: marketLiquidity?.tvl ?? ZERO_BN,
      liquidityTokenBalanceValue,
      claimableVaultRewards: latestAccountRewardEpoch?.claimableVaultRewards(market.address) ?? emptyVaultRewards,
    }
  }, [latestGlobalRewardEpoch, market, latestAccountRewardEpoch, emptyVaultRewards])

  const globalRewardEpochsSorted = useMemo(
    () => globalRewardEpochs.sort((a, b) => b.startTimestamp - a.startTimestamp),
    [globalRewardEpochs]
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
            <Text variant="heading">Overview</Text>
            <Text mt={8} mb={2}>
              This program rewards {formatTokenName(market.baseToken)} vault liquidity providers. Liquidity providers
              can stake LYRA to boost their rewards.
            </Text>
            <Grid mt={8} mb={4} sx={{ gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr' }}>
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
                &nbsp; · &nbsp;{formatDate(latestRewardEpoch.global.startTimestamp, true)} -{' '}
                {formatDate(latestRewardEpoch.global.endTimestamp, true)}
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
                    })} ${vaultApyMultiplier ? `(${formatNumber(vaultApyMultiplier)}x)` : ''}`}
                    valueColor={vaultApy.reduce((total, t) => total + t.amount, 0) > 0 ? 'primaryText' : 'text'}
                  />
                  <LabelItem
                    textVariant="body"
                    label="Pending Rewards"
                    value={
                      <RewardTokenAmounts
                        tokenAmounts={pendingRewards.length ? pendingRewards : emptyVaultRewards}
                        showDash={false}
                      />
                    }
                  />
                  <LabelItem
                    textVariant="body"
                    label="Claimable In"
                    value={<Countdown timestamp={latestGlobalRewardEpoch.endTimestamp + CLAIMABLE_REWARDS_DELAY} />}
                    valueColor="primaryText"
                  />
                </Grid>
                <LabelItem
                  mt={8}
                  label="Claimable Rewards"
                  value={<RewardTokenAmounts tokenAmounts={claimableVaultRewards} showDash={false} />}
                />
                <Flex mt={8}>
                  <ClaimModalButton
                    accountRewardEpoch={latestAccountRewardEpoch}
                    onClick={() => setIsOpen(true)}
                    minWidth={CTA_BUTTON_WIDTH}
                  />
                  <Button
                    ml={4}
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
        {account ? (
          <Card>
            <CardBody>
              <Text mb={6} variant="heading">
                History
              </Text>
              <Grid sx={{ gridTemplateColumns: REWARDS_HISTORY_GRID_COLUMN_TEMPLATE }}>
                <Text color="secondaryText">Epoch</Text>
                <Text color="secondaryText">Your Liquidity</Text>
                <Text ml="auto" color="secondaryText">
                  Your Rewards
                </Text>
              </Grid>
              {globalRewardEpochsSorted.map(globalRewardEpoch => {
                const accountEpoch = accountRewardEpochs.find(
                  accountRewardEpoch => accountRewardEpoch.globalEpoch.id === globalRewardEpoch.id
                )
                const vaultRewards = accountEpoch?.vaultRewards(market.address) ?? []
                const epochEmptyVaultRewards = globalRewardEpoch
                  .totalVaultRewards(market.address)
                  .map(t => ({ ...t, amount: 0 }))
                return (
                  <Grid
                    my={4}
                    key={globalRewardEpoch.id}
                    sx={{ gridTemplateColumns: REWARDS_HISTORY_GRID_COLUMN_TEMPLATE }}
                  >
                    <Text>
                      {formatDate(globalRewardEpoch.startTimestamp, true)} -{' '}
                      {formatDate(globalRewardEpoch.endTimestamp, true)}
                    </Text>
                    <Text>{formatUSD(accountEpoch?.vaultTokenBalance(market.address) ?? 0)}</Text>
                    <RewardTokenAmounts
                      ml="auto"
                      tokenAmounts={vaultRewards.length ? vaultRewards : epochEmptyVaultRewards}
                      hideTokenImages
                      showDash={true}
                    />
                  </Grid>
                )
              })}
            </CardBody>
          </Card>
        ) : null}
        {latestAccountRewardEpoch ? (
          <ClaimModal accountRewardEpoch={latestAccountRewardEpoch} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        ) : null}
      </PageGrid>
    </Page>
  )
}

export default RewardsVaultsPageHelper

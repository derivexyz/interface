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
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { AccountRewardEpoch, Network } from '@lyrafinance/lyra-js'
import React, { useMemo, useState } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import RewardTokenAmounts from '@/app/components/rewards/RewardTokenAmounts'
import { TradingFeeRebateTable } from '@/app/components/rewards/TradingFeeRebateTable'
import { PageId } from '@/app/constants/pages'
import { SECONDS_IN_MONTH } from '@/app/constants/time'
import ConnectWalletButton from '@/app/containers/common/ConnectWalletButton'
import RewardsClaimModal from '@/app/containers/rewards/RewardsClaimModal'
import RewardsClaimModalButton from '@/app/containers/rewards/RewardsClaimModalButton'
import RewardPageHeader from '@/app/containers/rewards/RewardsPageHeader'
import RewardsTradingRebateBoostModal from '@/app/containers/rewards/RewardsTradingRebateBoostModal'
import useNetwork from '@/app/hooks/account/useNetwork'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { LatestRewardEpoch } from '@/app/hooks/rewards/useRewardsPageData'
import { getDefaultMarket } from '@/app/utils/getDefaultMarket'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'
import getPagePath from '@/app/utils/getPagePath'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const CTA_BUTTON_WIDTH = 160
const MIN_COL_WIDTH = 150

type Props = {
  latestRewardEpoch: LatestRewardEpoch
  accountRewardEpochs: AccountRewardEpoch[]
}

const RewardsTradingPageHelper = ({ latestRewardEpoch, accountRewardEpochs }: Props) => {
  const isMobile = useIsMobile()
  const network = useNetwork()
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false)
  const account = useWalletAccount()
  const { global: latestGlobalRewardEpoch, account: latestAccountRewardEpoch } = latestRewardEpoch
  const effectiveRebate =
    latestAccountRewardEpoch?.tradingFeeRebate ?? latestGlobalRewardEpoch.tradingFeeRebateTiers[0].feeRebate
  const pendingRewards = latestAccountRewardEpoch?.tradingRewards.length
    ? latestAccountRewardEpoch.tradingRewards
    : latestGlobalRewardEpoch.tradingRewardTokens.map(t => ({ ...t, amount: 0 }))
  const claimableRewards = latestAccountRewardEpoch?.totalClaimableTradingRewards.length
    ? latestAccountRewardEpoch.totalClaimableTradingRewards
    : latestGlobalRewardEpoch.tradingRewardTokens.map(t => ({ ...t, amount: 0 }))

  const accountEpochsSorted = useMemo(
    () =>
      [...accountRewardEpochs]
        .filter(epoch => !!epoch.tradingRewards.find(t => t.amount > 0))
        .sort((a, b) => b.globalEpoch.distributionTimestamp - a.globalEpoch.distributionTimestamp),
    [accountRewardEpochs]
  )

  return (
    <Page header={!isMobile ? <RewardPageHeader /> : null} noHeaderPadding>
      <PageGrid>
        {isMobile ? <RewardPageHeader showBackButton={!isMobile} /> : null}
        <Flex mx={[6, 0]} mb={[6, 0]}>
          <Text variant="title">Trading Rewards</Text>
          <Text color="secondaryText" variant="title">
            &nbsp;·&nbsp;{getNetworkDisplayName(latestGlobalRewardEpoch.lyra.network)}
          </Text>
        </Flex>
        <Card>
          <CardSection>
            <Text variant="heading" mb={6}>
              Overview
            </Text>
            <Text color="secondaryText">
              This program allows traders to earn back part of their fees as LYRA
              {network === Network.Optimism ? ' and OP' : ''} tokens every two weeks. Traders can stake LYRA to boost
              fee rebates.
            </Text>
          </CardSection>
          <CardSeparator isHorizontal />
          <CardSection flexDirection={isMobile ? 'column' : 'row'} noPadding>
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
                  <Grid sx={{ gridTemplateColumns: '1fr 1fr' }}>
                    <LabelItem
                      textVariant="body"
                      label="Your Fees"
                      value={formatUSD(latestAccountRewardEpoch?.tradingFees ?? 0)}
                    />
                    <LabelItem
                      textVariant="body"
                      label="Your Rebate"
                      value={formatPercentage(effectiveRebate ?? 0, true)}
                      valueColor="primaryText"
                    />
                  </Grid>
                  <Grid sx={{ gridTemplateColumns: '1fr 1fr' }} my={8}>
                    <LabelItem
                      textVariant="body"
                      label="Pending Rewards"
                      value={<RewardTokenAmounts tokenAmounts={pendingRewards} showDash={false} />}
                    />
                    <LabelItem
                      textVariant="body"
                      label="Ends In"
                      value={<Countdown timestamp={latestGlobalRewardEpoch.distributionTimestamp} />}
                      valueColor="primaryText"
                    />
                  </Grid>
                  {claimableRewards.some(r => r.amount > 0) ? (
                    <LabelItem
                      textVariant="body"
                      label="Claimable Rewards"
                      value={<RewardTokenAmounts tokenAmounts={claimableRewards} showDash={false} />}
                    />
                  ) : null}
                  <Flex mt="auto" pt={6}>
                    {claimableRewards.some(r => r.amount > 0) ? (
                      <RewardsClaimModalButton
                        onClick={() => setIsClaimModalOpen(true)}
                        accountRewardEpoch={latestAccountRewardEpoch}
                        minWidth={CTA_BUTTON_WIDTH}
                        mr={4}
                      />
                    ) : null}
                    <Button
                      label="Trade"
                      href={getPagePath({
                        page: PageId.Trade,
                        network: latestRewardEpoch.global.lyra.network,
                        marketAddressOrName: getDefaultMarket(latestRewardEpoch.global.lyra.network),
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
            <CardSeparator isHorizontal={isMobile} />
            <CardSection isVertical>
              <Text variant="heading2" mb={6}>
                Fee Tiers
              </Text>
              <TradingFeeRebateTable
                feeRebateTiers={latestGlobalRewardEpoch.tradingFeeRebateTiers}
                effectiveRebate={effectiveRebate}
                minWidth={300}
                maxHeight={248}
                sx={{ overflow: 'scroll' }}
              />
              <Flex mt={4}>
                <Button
                  width="50%"
                  isDisabled={!account}
                  minWidth={CTA_BUTTON_WIDTH}
                  size="lg"
                  label="Stake"
                  onClick={() => setIsStakeModalOpen(true)}
                />
              </Flex>
            </CardSection>
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
                    Your Fees
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
                  const globalEpoch = accountEpoch.globalEpoch
                  const isPendingDistribution =
                    globalEpoch.blockTimestamp > globalEpoch.endTimestamp &&
                    !accountEpoch.isTradingRewardsDistributed &&
                    globalEpoch.blockTimestamp - globalEpoch.endTimestamp < SECONDS_IN_MONTH
                  const isLateDistribution =
                    isPendingDistribution && globalEpoch.blockTimestamp > globalEpoch.distributionTimestamp

                  const market = globalEpoch.markets[0]
                  if (!market) {
                    return null
                  }

                  return (
                    <Flex py={3} key={globalEpoch.id}>
                      <Text minWidth={MIN_COL_WIDTH}>{formatDate(globalEpoch.endTimestamp)}</Text>
                      <Text minWidth={MIN_COL_WIDTH}>
                        {formatBalance(
                          {
                            balance: accountEpoch.tradingFees,
                            symbol: market.quoteToken.symbol,
                            decimals: market.quoteToken.decimals,
                          },
                          { showDollars: true }
                        )}
                      </Text>
                      <Box minWidth={MIN_COL_WIDTH} ml="auto" textAlign={isMobile ? 'left' : 'right'}>
                        <Text>{accountEpoch.tradingRewards.map(t => formatBalance(t)).join(', ')}</Text>
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
      </PageGrid>
      {latestAccountRewardEpoch ? (
        <RewardsClaimModal
          accountRewardEpoch={latestAccountRewardEpoch}
          isOpen={isClaimModalOpen}
          onClose={() => setIsClaimModalOpen(false)}
        />
      ) : null}
      <RewardsTradingRebateBoostModal
        isOpen={isStakeModalOpen}
        onClose={() => setIsStakeModalOpen(false)}
        globalRewardEpoch={latestGlobalRewardEpoch}
        accountRewardEpoch={latestAccountRewardEpoch}
      />
    </Page>
  )
}

export default RewardsTradingPageHelper

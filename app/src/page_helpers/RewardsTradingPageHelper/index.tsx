import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatDate from '@lyra/ui/utils/formatDate'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { AccountRewardEpoch, GlobalRewardEpoch, Network } from '@lyrafinance/lyra-js'
import React, { useMemo, useState } from 'react'
import { useEffect } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import RewardTokenAmounts from '@/app/components/rewards/RewardTokenAmounts'
import { TradingFeeRebateTable } from '@/app/components/rewards/TradingFeeRebateTable'
import { CLAIMABLE_REWARDS_DELAY } from '@/app/constants/rewards'
import ConnectWalletButton from '@/app/containers/common/ConnectWalletButton'
import RewardsClaimModal from '@/app/containers/rewards/RewardsClaimModal'
import RewardsClaimModalButton from '@/app/containers/rewards/RewardsClaimModalButton'
import RewardPageHeader from '@/app/containers/rewards/RewardsPageHeader'
import RewardsTradingRebateBoostModal from '@/app/containers/rewards/RewardsTradingRebateBoostModal'
import useNetwork from '@/app/hooks/account/useNetwork'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { LatestRewardEpoch } from '@/app/hooks/rewards/useLatestRewardEpoch'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const CTA_BUTTON_WIDTH = 160

type Props = {
  latestRewardEpoch: LatestRewardEpoch
  accountRewardEpochs: AccountRewardEpoch[]
  globalRewardEpochs: GlobalRewardEpoch[]
}

const RewardsTradingPageHelper = ({ latestRewardEpoch, accountRewardEpochs, globalRewardEpochs }: Props) => {
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
    : latestGlobalRewardEpoch.tradingRewards(0, 0)
  const globalRewardEpochsSorted = useMemo(
    () => globalRewardEpochs.sort((a, b) => b.startTimestamp - a.startTimestamp),
    [globalRewardEpochs]
  )
  const claimableRewards = latestAccountRewardEpoch?.claimableRewards.tradingRewards.length
    ? latestAccountRewardEpoch?.claimableRewards.tradingRewards
    : latestGlobalRewardEpoch.tradingRewards(0, 0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
            <Text variant="heading">Overview</Text>
            <Text mt={8} mb={2}>
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
                      label="Claimable In"
                      value={<Countdown timestamp={latestGlobalRewardEpoch.endTimestamp + CLAIMABLE_REWARDS_DELAY} />}
                      valueColor="primaryText"
                    />
                  </Grid>
                  <LabelItem
                    textVariant="body"
                    label="Claimable Rewards"
                    value={<RewardTokenAmounts tokenAmounts={claimableRewards} showDash={false} />}
                  />
                  <Flex mt="auto" pt={6}>
                    <RewardsClaimModalButton
                      onClick={() => setIsClaimModalOpen(true)}
                      accountRewardEpoch={latestAccountRewardEpoch}
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
                maxHeight={285}
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
        {account ? (
          <Card>
            <CardBody>
              <Text mb={6} variant="heading">
                History
              </Text>
              <Grid sx={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <Text color="secondaryText">Epoch</Text>
                <Text color="secondaryText">Your Fees</Text>
                <Text ml="auto" color="secondaryText">
                  Your Rewards
                </Text>
              </Grid>
              {globalRewardEpochsSorted.map(globalRewardEpoch => {
                const accountEpoch = accountRewardEpochs.find(
                  accountRewardEpoch => accountRewardEpoch.globalEpoch.id === globalRewardEpoch.id
                )
                return (
                  <Grid my={4} key={globalRewardEpoch.id} sx={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <Text>
                      {formatDate(globalRewardEpoch.startTimestamp, true)} -{' '}
                      {formatDate(globalRewardEpoch.endTimestamp, true)}
                    </Text>
                    <Text>{accountEpoch ? formatUSD(accountEpoch.tradingFees) : formatUSD(0)}</Text>
                    <RewardTokenAmounts
                      ml="auto"
                      tokenAmounts={accountEpoch?.tradingRewards ?? globalRewardEpoch.tradingRewards(0, 0)}
                      showDash={false}
                      hideTokenImages
                    />
                  </Grid>
                )
              })}
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

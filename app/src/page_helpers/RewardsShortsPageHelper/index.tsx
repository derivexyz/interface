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
import formatUSD from '@lyra/ui/utils/formatUSD'
import { AccountRewardEpoch, GlobalRewardEpoch, Network } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'
import React, { useMemo, useState } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import RewardTokenAmounts from '@/app/components/rewards/RewardTokenAmounts'
import { CLAIMABLE_REWARDS_DELAY } from '@/app/constants/rewards'
import ConnectWalletButton from '@/app/containers/common/ConnectWalletButton'
import ClaimModal from '@/app/containers/rewards/ClaimModal'
import ClaimModalButton from '@/app/containers/rewards/ClaimModalButton'
import RewardPageHeader from '@/app/containers/rewards/RewardsPageHeader'
import useNetwork from '@/app/hooks/account/useNetwork'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { LatestRewardEpoch } from '@/app/hooks/rewards/useLatestRewardEpoch'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const CTA_BUTTON_WIDTH = 160

type Props = {
  collateral: BigNumber
  latestRewardEpoch: LatestRewardEpoch
  accountRewardEpochs: AccountRewardEpoch[]
  globalRewardEpochs: GlobalRewardEpoch[]
}

const RewardsShortsPageHelper = ({ latestRewardEpoch, accountRewardEpochs, globalRewardEpochs, collateral }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()
  const account = useWalletAccount()
  const network = useNetwork()
  const { global: latestGlobalRewardEpoch, account: latestAccountRewardEpoch } = latestRewardEpoch
  const pendingRewards = latestAccountRewardEpoch?.shortCollateralRewards.length
    ? latestAccountRewardEpoch?.shortCollateralRewards
    : latestGlobalRewardEpoch.shortCollateralRewards(0)
  const globalRewardEpochsSorted = useMemo(
    () => globalRewardEpochs.sort((a, b) => b.startTimestamp - a.startTimestamp),
    [globalRewardEpochs]
  )
  const claimableRewards = latestAccountRewardEpoch?.claimableRewards.tradingRewards.length
    ? latestAccountRewardEpoch?.claimableRewards.tradingRewards
    : latestGlobalRewardEpoch.shortCollateralRewards(0)
  return (
    <Page header={!isMobile ? <RewardPageHeader /> : null} noHeaderPadding>
      <PageGrid>
        {isMobile ? <RewardPageHeader showBackButton={!isMobile} /> : null}
        <Flex mx={[6, 0]} mb={[6, 0]}>
          <Text variant="title">Short Rewards</Text>
          <Text color="secondaryText" variant="title">
            &nbsp;·&nbsp;{getNetworkDisplayName(latestGlobalRewardEpoch.lyra.network)}
          </Text>
        </Flex>
        <Card>
          <CardSection>
            <Text variant="heading">Overview</Text>
            <Text mt={8} mb={2}>
              This program rewards traders for selling calls and puts with LYRA{' '}
              {network === Network.Optimism ? 'and OP' : ''} tokens every two weeks. This program is not subject to
              boosts.
            </Text>
          </CardSection>
          <CardSeparator isHorizontal />
          <CardSection isVertical sx={{ flexGrow: 1 }}>
            <Flex mb={8}>
              <Text variant="heading">Your Rewards</Text>
              <Text variant="heading" color="secondaryText">
                &nbsp;·&nbsp;{formatDate(latestRewardEpoch.global.startTimestamp, true)} -{' '}
                {formatDate(latestRewardEpoch.global.endTimestamp, true)}
              </Text>
            </Flex>
            {account ? (
              <>
                <Grid sx={{ gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr', rowGap: 8 }}>
                  <LabelItem textVariant="body" label="Your Collateral" value={formatUSD(collateral)} />
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
                  mt={8}
                  textVariant="body"
                  label="Claimable Rewards"
                  value={<RewardTokenAmounts tokenAmounts={claimableRewards} showDash={false} />}
                />
                <Flex mt={8}>
                  <ClaimModalButton
                    accountRewardEpoch={latestAccountRewardEpoch}
                    onClick={() => setIsOpen(true)}
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
              <Grid sx={{ gridTemplateColumns: '1fr 1fr' }}>
                <Text color="secondaryText">Epoch</Text>
                <Text ml="auto" color="secondaryText">
                  Your Rewards
                </Text>
              </Grid>
              {globalRewardEpochsSorted.map(globalRewardEpoch => {
                const accountEpoch = accountRewardEpochs.find(
                  accountRewardEpoch => accountRewardEpoch.globalEpoch.id === globalRewardEpoch.id
                )
                return (
                  <Grid my={4} key={globalRewardEpoch.id} sx={{ gridTemplateColumns: '1fr 1fr' }}>
                    <Text>
                      {formatDate(globalRewardEpoch.startTimestamp, true)} -{' '}
                      {formatDate(globalRewardEpoch.endTimestamp, true)}
                    </Text>
                    <RewardTokenAmounts
                      ml="auto"
                      tokenAmounts={accountEpoch?.shortCollateralRewards ?? globalRewardEpoch.tradingRewards(0, 0)}
                      hideTokenImages
                      showDash={false}
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

export default RewardsShortsPageHelper

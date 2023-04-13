import Box from '@lyra/ui/components/Box'
import Card from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import Countdown from '@lyra/ui/components/Text/CountdownText'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatDate from '@lyra/ui/utils/formatDate'
import React from 'react'
import { useMemo } from 'react'

import { SECONDS_IN_MONTH } from '@/app/constants/time'
import LeaderboardPageHeader from '@/app/containers/leaderboard/LeaderboardPageHeader'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { LeaderboardHistoryPageData } from '@/app/hooks/leaderboard/useLeaderboardHistoryPageData'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const MIN_COL_WIDTH = 150

type Props = {
  data: LeaderboardHistoryPageData
} & MarginProps

const LeaderboardHistoryPageHelper = ({ data, ...marginProps }: Props): JSX.Element => {
  const { latestGlobalRewardEpoch, latestAccountRewardEpoch } = data
  const isMobile = useIsMobile()
  const account = useWalletAccount()
  const { accountRewardEpochs } = data
  const accountRewardEpochsSorted = useMemo(
    () => accountRewardEpochs?.sort((a, b) => b.accountEpoch.startTimestamp - a.accountEpoch.startTimestamp),
    [accountRewardEpochs]
  )
  return (
    <Page
      noHeaderPadding
      header={
        !isMobile ? (
          <LeaderboardPageHeader
            latestGlobalRewardEpoch={latestGlobalRewardEpoch}
            latestAccountRewardEpoch={latestAccountRewardEpoch}
            showHistoryButton={false}
          />
        ) : null
      }
      {...marginProps}
    >
      <PageGrid>
        <Text variant="heading" color="text" mt={[4, 0]} ml={[4, 0]}>
          History
        </Text>
        {account && accountRewardEpochs && accountRewardEpochs.length > 0 ? (
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
                {accountRewardEpochsSorted?.map(accountEpoch => {
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
        ) : (
          <Text variant="bodyMedium" color="text">
            No rewards history.
          </Text>
        )}
      </PageGrid>
    </Page>
  )
}

export default LeaderboardHistoryPageHelper

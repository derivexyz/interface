import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Card, { CardElement } from '@lyra/ui/components/Card'
import CardBody from '@lyra/ui/components/Card/CardBody'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import Image from '@lyra/ui/components/Image'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { MarginProps } from '@lyra/ui/types'
import formatUSD from '@lyra/ui/utils/formatUSD'
import React, { useState } from 'react'

import ChartPeriodSelector from '@/app/components/common/ChartPeriodSelector'
import { ChartPeriod } from '@/app/constants/chart'
import { PORTFOLIO_CARD_HEIGHT } from '@/app/constants/layout'
import { LogEvent } from '@/app/constants/logEvents'
import { Network } from '@/app/constants/networks'
import { SOCKET_NATIVE_TOKEN_ADDRESS } from '@/app/constants/token'
import OnboardingModal, { OnboardingModalStep } from '@/app/containers/common/OnboardingModal'
import PortfolioBalanceCardHistoryChart from '@/app/containers/portfolio/PortfolioBalanceCard/PortfolioBalanceCardHistoryChart'
import useOptimismToken from '@/app/hooks/data/useOptimismToken'
import withSuspense from '@/app/hooks/data/withSuspense'
import useEthBalance from '@/app/hooks/erc20/useEthBalance'
import usePortfolioBalance from '@/app/hooks/portfolio/usePortfolioBalance'
import { PortfolioSnapshot } from '@/app/hooks/portfolio/usePortfolioHistory'
import useWallet from '@/app/hooks/wallet/useWallet'
import getAssetSrc from '@/app/utils/getAssetSrc'
import isOptimismMainnet from '@/app/utils/isOptimismMainnet'
import logEvent from '@/app/utils/logEvent'

import ConnectWalletButton from '../../common/ConnectWalletButton'
import TestFaucetModal from '../../common/TestFaucetModal'
import PortfolioBalanceCardPctChangeText from './PortfolioBalanceCardPctChangeText'

const PERIODS = [ChartPeriod.OneWeek, ChartPeriod.OneMonth, ChartPeriod.ThreeMonths, ChartPeriod.AllTime]

const PortfolioBalanceCard = withSuspense(
  ({ ...marginProps }: MarginProps): CardElement => {
    const [period, setPeriod] = useState(ChartPeriod.OneWeek)
    const [hoverSnapshot, setHoverSnapshot] = useState<PortfolioSnapshot | null>(null)
    const isMobile = useIsMobile()
    const portfolioBalance = usePortfolioBalance()
    const { totalValue } = portfolioBalance
    const { isConnected } = useWallet()
    const [isFaucetOpen, setIsFaucetOpen] = useState(false)
    const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false)
    const ethBalance = useEthBalance(Network.Optimism)
    const susd = useOptimismToken('susd')
    const helpSection = (
      <CardSection justifyContent="center" alignItems="center" height="100%" width="100%">
        <Image src={getAssetSrc('/images/logo.png')} mb={4} size={42} />
        <Text variant="title" mb={4}>
          Welcome to Lyra
        </Text>
        <Text textAlign="center" variant="secondary" color="secondaryText" mb={6}>
          To start trading, swap to sUSD on Optimism
        </Text>
        {!isConnected ? (
          <ConnectWalletButton size="lg" width={280} />
        ) : isOptimismMainnet() ? (
          <Button
            size="lg"
            variant="primary"
            label="Get Started"
            onClick={() => {
              setIsOnboardingModalOpen(true)
              logEvent(LogEvent.OnboardingModalOpen)
            }}
            width={280}
          />
        ) : (
          <Button
            size="lg"
            variant="primary"
            label="Drip Stables and Synths"
            width={280}
            onClick={() => setIsFaucetOpen(true)}
          />
        )}
        <TestFaucetModal isOpen={isFaucetOpen} onClose={() => setIsFaucetOpen(false)} />
      </CardSection>
    )

    const latestSnapshot = hoverSnapshot ?? portfolioBalance
    const collateral = latestSnapshot.baseCollateralValue + latestSnapshot.stableCollateralValue
    const balance = latestSnapshot.baseAccountValue + latestSnapshot.stableAccountValue
    const options = latestSnapshot.longOptionValue + latestSnapshot.shortOptionValue

    const portfolioSections = isMobile ? (
      <>
        <CardBody height="100%">
          <Text variant="title">Portfolio</Text>
          <Text variant="title">{formatUSD(latestSnapshot.totalValue, { dps: 2 })}</Text>
          <PortfolioBalanceCardPctChangeText period={period} hoverSnapshot={hoverSnapshot} />
          <PortfolioBalanceCardHistoryChart
            flexGrow={1}
            period={period}
            onHover={setHoverSnapshot}
            hoverSnapshot={hoverSnapshot}
            mb={1}
          />
          <Flex>
            <ChartPeriodSelector selectedPeriod={period} periods={PERIODS} onChangePeriod={setPeriod} />
          </Flex>
        </CardBody>
      </>
    ) : (
      <>
        <CardSection width={220} isHorizontal>
          <Box mb={4}>
            <Text variant="title">Portfolio</Text>
            <Text variant="title">{formatUSD(latestSnapshot.totalValue, { dps: 2 })}</Text>
            <PortfolioBalanceCardPctChangeText hoverSnapshot={hoverSnapshot} period={period} />
          </Box>
          <Box mb={4}>
            <Text color="secondaryText" variant="secondary" mb={2}>
              {latestSnapshot.shortOptionValue < 0 ? 'Net Options' : 'Options'}
            </Text>
            <Text variant="bodyMedium">{formatUSD(options, { dps: 2 })}</Text>
          </Box>
          {collateral > 0 ? (
            <Box mb={4}>
              <Text color="secondaryText" variant="secondary" mb={2}>
                Short Collateral
              </Text>
              <Text variant="bodyMedium">{formatUSD(collateral, { dps: 2 })}</Text>
            </Box>
          ) : null}
          <Box>
            <Text color="secondaryText" variant="secondary" mb={2}>
              Free Collateral
            </Text>
            <Text variant="bodyMedium">{formatUSD(balance, { dps: 2 })}</Text>
          </Box>
        </CardSection>
        <CardSeparator isVertical />
        <CardSection flexGrow={1}>
          <Flex mb={2} justifyContent="flex-end">
            <ChartPeriodSelector selectedPeriod={period} periods={PERIODS} onChangePeriod={setPeriod} />
          </Flex>
          <PortfolioBalanceCardHistoryChart
            flexGrow={1}
            period={period}
            onHover={setHoverSnapshot}
            hoverSnapshot={hoverSnapshot}
          />
        </CardSection>
      </>
    )

    return (
      <Card flexDirection={isMobile ? 'column' : 'row'} height={PORTFOLIO_CARD_HEIGHT} {...marginProps}>
        <OnboardingModal
          isOpen={isOnboardingModalOpen}
          onClose={() => setIsOnboardingModalOpen(false)}
          defaultDestToken={ethBalance.eq(0) ? SOCKET_NATIVE_TOKEN_ADDRESS : susd?.address}
          step={ethBalance.eq(0) ? OnboardingModalStep.GetETH : OnboardingModalStep.GetTokens}
        />
        {totalValue > 0 ? portfolioSections : helpSection}
      </Card>
    )
  },
  ({ ...marginProps }) => (
    <Card height={PORTFOLIO_CARD_HEIGHT} justifyContent="center" alignItems="center" {...marginProps}>
      <CardBody width="100%" height="100%">
        <Center height="100%">
          <Spinner />
        </Center>
      </CardBody>
    </Card>
  )
)

export default PortfolioBalanceCard

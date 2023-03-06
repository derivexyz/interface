import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import formatTruncatedUSD from '@lyra/ui/utils/formatTruncatedUSD'
import formatUSD from '@lyra/ui/utils/formatUSD'
import { AccountWethLyraStaking, WethLyraStaking } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'
import React, { useState } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import TokenAmountText from '@/app/components/common/TokenAmountText'
import TokenImageStack from '@/app/components/common/TokenImageStack'
import { ZERO_BN } from '@/app/constants/bn'
import { WETH_LYRA_L1_LIQUIDITY_URL } from '@/app/constants/links'
import ConnectWalletButton from '@/app/containers/common/ConnectWalletButton'
import RewardPageHeader from '@/app/containers/rewards/RewardsPageHeader'
import RewardsWethLyraClaimModal from '@/app/containers/rewards/RewardsWethLyraClaimModal'
import RewardsWethLyraL2UnstakeModal from '@/app/containers/rewards/RewardsWethLyraL2UnstakeModal'
import RewardsWethLyraStakeModal from '@/app/containers/rewards/RewardsWethLyraStakeModal'
import RewardsWethLyraUnstakeModal from '@/app/containers/rewards/RewardsWethLyraUnstakeModal'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import fromBigNumber from '@/app/utils/fromBigNumber'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const CTA_BUTTON_WIDTH = 160

type Props = {
  claimableBalance: BigNumber
  wethLyraStakingAccount: AccountWethLyraStaking | null
  wethLyraStakingAccountL2: AccountWethLyraStaking | null
  wethLyraStaking: WethLyraStaking
}

const RewardsEthLyraLPPageHelper = ({
  claimableBalance,
  wethLyraStaking,
  wethLyraStakingAccount,
  wethLyraStakingAccountL2,
}: Props) => {
  const isMobile = useIsMobile()
  const account = useWalletAccount()
  const [isOpen, setIsOpen] = useState(false)
  const [isStakeOpen, setIsStakeOpen] = useState(false)
  const [isUnstakeOpen, setIsUnstakeOpen] = useState(false)
  const [isL2UnstakeOpen, setIsL2UnstakeOpen] = useState(false)
  const stakedLPTokenBalance = fromBigNumber(wethLyraStakingAccount?.stakedLPTokenBalance ?? ZERO_BN)
  const poolLyraBalance = stakedLPTokenBalance * wethLyraStaking.lyraPerToken
  const poolWethBalance = stakedLPTokenBalance * wethLyraStaking.wethPerToken
  return (
    <Page header={!isMobile ? <RewardPageHeader /> : null} noHeaderPadding>
      <PageGrid>
        {isMobile ? <RewardPageHeader showBackButton={!isMobile} /> : null}
        <Flex mx={[6, 0]} mb={[6, 0]}>
          <Text variant="heading">LYRA-ETH LP Rewards</Text>
          <Text color="secondaryText" variant="heading">
            &nbsp;·&nbsp;Ethereum
          </Text>
        </Flex>
        <Card>
          <CardSection>
            <Text variant="heading">Overview</Text>
            <Text variant="secondary" mt={8} mb={2}>
              This program rewards WETH / LYRA liquidity providers on the Uniswap v3 pool via Arrakis Finance. LPs earn
              LYRA tokens which can be claimed at any time.
            </Text>
            <Grid mt={8} mb={4} sx={{ gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr' }}>
              <LabelItem label="TVL" value={formatTruncatedUSD(wethLyraStaking.stakedTVL)} />
              <LabelItem label="APY" value={formatPercentage(wethLyraStaking.apy, true)} />
            </Grid>
          </CardSection>
          <CardSeparator isHorizontal />
          <CardSection isVertical sx={{ flexGrow: 1 }}>
            <Text mb={8} variant="heading">
              Your Rewards
            </Text>
            {account ? (
              <>
                <Grid sx={{ gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr', rowGap: 8 }}>
                  <LabelItem
                    label="Your Balance"
                    value={
                      <Flex>
                        <TokenImageStack mr={2} tokenNameOrAddresses={['eth', 'lyra']} size={24} />
                        <Text>
                          {formatNumber(poolWethBalance)} ETH, {formatNumber(poolLyraBalance)} LYRA
                        </Text>
                      </Flex>
                    }
                  />
                  <LabelItem
                    label="Your Liquidity"
                    value={formatUSD(
                      fromBigNumber(wethLyraStakingAccount?.stakedLPTokenBalance ?? ZERO_BN) *
                        wethLyraStaking.lpTokenValue
                    )}
                  />
                  <LabelItem
                    label="Claimable Rewards"
                    value={<TokenAmountText tokenNameOrAddress="lyra" amount={claimableBalance} />}
                    valueColor="primaryText"
                  />
                </Grid>
                <Flex mt={8}>
                  <Button
                    isDisabled={claimableBalance.isZero()}
                    label="Claim"
                    variant="primary"
                    size="lg"
                    onClick={() => setIsOpen(true)}
                    minWidth={CTA_BUTTON_WIDTH}
                  />
                  <Button
                    ml={4}
                    label="Stake"
                    size="lg"
                    onClick={() => setIsStakeOpen(true)}
                    minWidth={CTA_BUTTON_WIDTH}
                  />
                  {wethLyraStakingAccount?.stakedLPTokenBalance.gt(0) ? (
                    <Button
                      ml={4}
                      label="Unstake"
                      size="lg"
                      onClick={() => setIsUnstakeOpen(true)}
                      minWidth={CTA_BUTTON_WIDTH}
                    />
                  ) : null}
                  {wethLyraStakingAccountL2?.stakedLPTokenBalance.gt(0) ? (
                    <Button
                      ml={4}
                      label="Unstake L2 WETH/LYRA"
                      size="lg"
                      variant="warning"
                      onClick={() => setIsL2UnstakeOpen(true)}
                      minWidth={CTA_BUTTON_WIDTH}
                    />
                  ) : null}
                  <Button
                    ml={4}
                    width={CTA_BUTTON_WIDTH}
                    label="Add Liquidity"
                    rightIcon={IconType.ArrowUpRight}
                    size="lg"
                    href={WETH_LYRA_L1_LIQUIDITY_URL + '/add'}
                    target="_blank"
                  />
                </Flex>
              </>
            ) : (
              <Flex>
                <ConnectWalletButton width={CTA_BUTTON_WIDTH} size="lg" network={'ethereum'} />
              </Flex>
            )}
          </CardSection>
        </Card>
      </PageGrid>
      <RewardsWethLyraClaimModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <RewardsWethLyraStakeModal isOpen={isStakeOpen} onClose={() => setIsStakeOpen(false)} />
      <RewardsWethLyraUnstakeModal isOpen={isUnstakeOpen} onClose={() => setIsUnstakeOpen(false)} />
      <RewardsWethLyraUnstakeModal isOpen={isUnstakeOpen} onClose={() => setIsUnstakeOpen(false)} />
      <RewardsWethLyraL2UnstakeModal isOpen={isL2UnstakeOpen} onClose={() => setIsL2UnstakeOpen(false)} />
    </Page>
  )
}

export default RewardsEthLyraLPPageHelper

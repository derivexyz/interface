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
import React, { useState } from 'react'

import LabelItem from '@/app/components/common/LabelItem'
import TokenAmountText from '@/app/components/common/TokenAmountText'
import TokenImageStack from '@/app/components/common/TokenImageStack'
import { ARRAKIS_LIQUIDITY_URL } from '@/app/constants/links'
import { AppNetwork } from '@/app/constants/networks'
import ConnectWalletButton from '@/app/containers/common/ConnectWalletButton'
import TotalSupplyHeaderCard from '@/app/containers/common/TotalSupplyHeaderCard'
import RewardsArrakisClaimModal from '@/app/containers/earn/RewardsArrakisClaimModal'
import RewardsArrakisOpUnstakeModal from '@/app/containers/earn/RewardsArrakisOpUnstakeModal'
import RewardsArrakisStakeModal from '@/app/containers/earn/RewardsArrakisStakeModal'
import RewardsArrakisUnstakeModal from '@/app/containers/earn/RewardsArrakisUnstakeModal'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import fromBigNumber from '@/app/utils/fromBigNumber'
import { ArrakisOpStaking } from '@/app/utils/rewards/fetchArrakisOptimismAccount'
import { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

const CTA_BUTTON_WIDTH = 160

type Props = {
  arrakisStaking: ArrakisStaking
  arrakisOpStakingAccount: ArrakisOpStaking | null
}

const EarnArrakisPageHelper = ({ arrakisStaking, arrakisOpStakingAccount }: Props) => {
  const isMobile = useIsMobile()
  const account = useWalletAccount()
  const [isOpen, setIsOpen] = useState(false)
  const [isStakeOpen, setIsStakeOpen] = useState(false)
  const [isUnstakeOpen, setIsUnstakeOpen] = useState(false)
  const [isOpUnstakeOpen, setIsOpUnstakeOpen] = useState(false)
  const stakedLPTokenBalance = fromBigNumber(arrakisStaking.stakedLPTokenBalance)
  const poolLyraBalance = stakedLPTokenBalance * arrakisStaking.lyraPerToken
  const poolWethBalance = stakedLPTokenBalance * arrakisStaking.wethPerToken
  return (
    <Page title="Earn" subtitle="Stake, deposit and refer" headerCard={<TotalSupplyHeaderCard />}>
      <PageGrid>
        <Text variant="heading">
          LYRA-ETH LP Rewards
          <Text color="secondaryText" as="span">
            &nbsp;·&nbsp;Ethereum
          </Text>
        </Text>
        <Card>
          <CardSection>
            <Text variant="cardHeading" mb={6}>
              Overview
            </Text>
            <Text color="secondaryText" mb={6}>
              This program rewards WETH / LYRA liquidity providers on the Uniswap v3 pool via Arrakis Finance. LPs earn
              LYRA tokens which can be claimed at any time.
            </Text>
            <Grid mb={4} sx={{ gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr' }}>
              <LabelItem label="TVL" value={formatTruncatedUSD(arrakisStaking.stakedTVL)} />
              <LabelItem label="APY" value={formatPercentage(arrakisStaking.apy, true)} />
            </Grid>
          </CardSection>
          <CardSeparator isHorizontal />
          <CardSection isVertical sx={{ flexGrow: 1 }}>
            <Text mb={6} variant="cardHeading">
              Your Rewards
            </Text>
            {account ? (
              <>
                <Grid mb={6} sx={{ gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr', rowGap: 8 }}>
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
                    value={formatUSD(fromBigNumber(arrakisStaking.stakedLPTokenBalance) * arrakisStaking.lpTokenValue)}
                  />
                  <LabelItem
                    label="Claimable Rewards"
                    value={<TokenAmountText tokenNameOrAddress="lyra" amount={arrakisStaking.rewards} />}
                    valueColor="primaryText"
                  />
                </Grid>
                <Flex>
                  {arrakisStaking?.rewards.gt(0) ? (
                    <Button
                      mr={4}
                      label="Claim"
                      variant="primary"
                      size="lg"
                      onClick={() => setIsOpen(true)}
                      minWidth={CTA_BUTTON_WIDTH}
                    />
                  ) : null}
                  <Button
                    mr={4}
                    label="Stake"
                    size="lg"
                    onClick={() => setIsStakeOpen(true)}
                    minWidth={CTA_BUTTON_WIDTH}
                  />
                  {arrakisStaking.stakedLPTokenBalance.gt(0) ? (
                    <Button
                      mr={4}
                      label="Unstake"
                      size="lg"
                      onClick={() => setIsUnstakeOpen(true)}
                      minWidth={CTA_BUTTON_WIDTH}
                    />
                  ) : null}
                  {arrakisOpStakingAccount?.stakedLPTokenBalance.gt(0) ? (
                    <Button
                      mr={4}
                      label="Unstake L2 WETH/LYRA"
                      size="lg"
                      variant="warning"
                      onClick={() => setIsOpUnstakeOpen(true)}
                      minWidth={CTA_BUTTON_WIDTH}
                    />
                  ) : null}
                  <Button
                    width={CTA_BUTTON_WIDTH}
                    label="Add Liquidity"
                    rightIcon={IconType.ArrowUpRight}
                    size="lg"
                    href={ARRAKIS_LIQUIDITY_URL}
                    target="_blank"
                  />
                </Flex>
              </>
            ) : (
              <Flex>
                <ConnectWalletButton width={CTA_BUTTON_WIDTH} size="lg" network={AppNetwork.Ethereum} />
              </Flex>
            )}
          </CardSection>
        </Card>
      </PageGrid>
      <RewardsArrakisClaimModal arrakisStaking={arrakisStaking} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <RewardsArrakisStakeModal
        arrakisStaking={arrakisStaking}
        isOpen={isStakeOpen}
        onClose={() => setIsStakeOpen(false)}
      />
      <RewardsArrakisUnstakeModal
        arrakisStaking={arrakisStaking}
        isOpen={isUnstakeOpen}
        onClose={() => setIsUnstakeOpen(false)}
      />
      <RewardsArrakisOpUnstakeModal
        arrakisOpStaking={arrakisOpStakingAccount}
        isOpen={isOpUnstakeOpen}
        onClose={() => setIsOpUnstakeOpen(false)}
      />
    </Page>
  )
}

export default EarnArrakisPageHelper

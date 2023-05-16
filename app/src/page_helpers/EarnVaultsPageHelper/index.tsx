import Flex from '@lyra/ui/components/Flex'
import Link from '@lyra/ui/components/Link'
import Text from '@lyra/ui/components/Text'
import { AccountRewardEpoch } from '@lyrafinance/lyra-js'
import { GlobalRewardEpoch } from '@lyrafinance/lyra-js'
import React from 'react'
import { useMemo } from 'react'
import { useState } from 'react'

import { VAULT_REWARDS_DOC_URL } from '@/app/constants/links'
import { PageId } from '@/app/constants/pages'
import { Vault } from '@/app/constants/vault'
import EarnVaultsHeaderCard from '@/app/containers/earn/EarnVaultsHeaderCard'
import RewardsClaimModal from '@/app/containers/earn/RewardsClaimModal'
import VaultsChartCard from '@/app/containers/vaults/VaultsChartCard'
import VaultsHistoryCard from '@/app/containers/vaults/VaultsHistoryCard'
import VaultsMarketDropdown from '@/app/containers/vaults/VaultsMarketDropdown'
import VaultsMyLiquidityCard from '@/app/containers/vaults/VaultsMyLiquidityCard'
import VaultsStatsCard from '@/app/containers/vaults/VaultsStatsCard'
import getPagePath from '@/app/utils/getPagePath'

import Page from '../common/Page'
import PageGrid from '../common/Page/PageGrid'

type Props = {
  vaults: Vault[]
  vault: Vault
  latestGlobalRewardEpoch: GlobalRewardEpoch
  accountRewardEpochs: AccountRewardEpoch[]
}

const EarnVaultsPageHelper = ({ vaults, vault, latestGlobalRewardEpoch, accountRewardEpochs }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const market = vault.market
  const latestAccountRewardEpoch = vault.accountRewardEpoch

  const emptyRewards = useMemo(
    () => latestGlobalRewardEpoch.vaultRewardTokens.map(t => ({ ...t, amount: 0 })),
    [latestGlobalRewardEpoch.vaultRewardTokens]
  )

  const totalClaimableRewards = useMemo(() => {
    const totalClaimableRewards = latestAccountRewardEpoch?.totalClaimableVaultRewards(market.address)
    return totalClaimableRewards && totalClaimableRewards.length ? totalClaimableRewards : emptyRewards
  }, [emptyRewards, latestAccountRewardEpoch, market.address])

  return (
    <Page
      title="Earn"
      subtitle="Stake, deposit and refer"
      headerCard={
        <EarnVaultsHeaderCard
          latestAccountRewardEpoch={latestAccountRewardEpoch}
          totalClaimableRewards={totalClaimableRewards}
          onClickClaim={() => setIsOpen(true)}
        />
      }
      showBackButton
      backHref={getPagePath({ page: PageId.EarnIndex })}
    >
      <PageGrid>
        <Flex>
          <VaultsMarketDropdown vaults={vaults} selectedVault={vault} />
        </Flex>
        <Text color="secondaryText">
          Deposit stablecoins to market maker vaults to earn fees and rewards.{' '}
          <Link variant="body" color="text" showRightIcon href={VAULT_REWARDS_DOC_URL} target="_blank">
            Learn more
          </Link>
        </Text>
        <VaultsChartCard market={market} />
        <VaultsMyLiquidityCard vault={vault} />
        <VaultsStatsCard market={market} />
        <VaultsHistoryCard
          vault={vault}
          latestGlobalRewardEpoch={latestGlobalRewardEpoch}
          accountRewardEpochs={accountRewardEpochs}
        />
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

export default EarnVaultsPageHelper

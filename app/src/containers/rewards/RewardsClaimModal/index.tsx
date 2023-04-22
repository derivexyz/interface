import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Collapsible from '@lyra/ui/components/Collapsible'
import Flex from '@lyra/ui/components/Flex'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Link from '@lyra/ui/components/Link'
import Modal from '@lyra/ui/components/Modal'
import ModalSection from '@lyra/ui/components/Modal/ModalSection'
import Text from '@lyra/ui/components/Text'
import Tooltip from '@lyra/ui/components/Tooltip'
import { AccountRewardEpoch } from '@lyrafinance/lyra-js'
import React from 'react'
import { useState } from 'react'
import { useMemo } from 'react'

import RowItem from '@/app/components/common/RowItem'
import { VAULT_REWARDS_DOC_URL } from '@/app/constants/links'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import { useMutateRewardsPageData } from '@/app/hooks/rewards/useRewardsPageData'
import formatRewardTokenAmounts from '@/app/utils/formatRewardTokenAmounts'
import formatTokenName from '@/app/utils/formatTokenName'
import getLyraSDK from '@/app/utils/getLyraSDK'
import sumRewardTokenAmounts from '@/app/utils/sumRewardTokenAmounts'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  isOpen: boolean
  onClose: () => void
  accountRewardEpoch: AccountRewardEpoch
}

export default function RewardsClaimModal({ accountRewardEpoch, isOpen, onClose }: Props) {
  const [isVaultExpanded, setIsVaultExpanded] = useState(true)
  const execute = useTransaction(accountRewardEpoch.lyra.network)
  const mutateRewardsPageData = useMutateRewardsPageData()
  const totalTradingRewards = accountRewardEpoch.totalClaimableTradingRewards

  const totalRewards = accountRewardEpoch.totalClaimableRewards

  const totalVaultRewards = useMemo(
    () =>
      sumRewardTokenAmounts(
        accountRewardEpoch.globalEpoch.markets.flatMap(market =>
          accountRewardEpoch.totalClaimableVaultRewards(market.address)
        )
      ),
    [accountRewardEpoch]
  )

  const totalOtherRewards = useMemo(
    () =>
      accountRewardEpoch.totalClaimableRewards
        .map(claimable => {
          let amount = claimable.amount
          const tradingRewards = totalTradingRewards.find(t => t.address === claimable.address)
          if (tradingRewards) {
            amount -= tradingRewards.amount
          }
          const vaultRewards = totalVaultRewards.find(t => t.address === claimable.address)
          if (vaultRewards) {
            amount -= vaultRewards.amount
          }
          return {
            ...claimable,
            amount,
          }
        })
        .filter(({ amount }) => amount > 0),
    [accountRewardEpoch.totalClaimableRewards, totalTradingRewards, totalVaultRewards]
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Claim Rewards" width={450}>
      <ModalSection noPadding pb={4}>
        <Flex px={6} py={6}>
          <Text color="secondaryText">
            Claim rewards together to save on gas fees. The table below shows a breakdown of your claimable rewards for
            each program you are participating in.
          </Text>
        </Flex>
        {totalVaultRewards.length ? (
          <Collapsible
            isExpanded={isVaultExpanded}
            noPadding
            onClickHeader={() => setIsVaultExpanded(!isVaultExpanded)}
            header={
              <RowItem
                width="100%"
                mx={6}
                my={4}
                textVariant="bodyMedium"
                label="Vaults"
                value={
                  <Flex ml="auto">
                    <Text variant="bodyMedium">{formatRewardTokenAmounts(totalVaultRewards)}</Text>
                    <Icon ml={2} icon={isVaultExpanded ? IconType.ChevronUp : IconType.ChevronDown} />
                  </Flex>
                }
              />
            }
          >
            {accountRewardEpoch.globalEpoch.markets
              .filter(market => accountRewardEpoch.totalClaimableVaultRewards(market.address).length > 0)
              .map(market => {
                const vaultRewards = accountRewardEpoch.totalClaimableVaultRewards(market.address)
                return (
                  <RowItem
                    key={market.address}
                    my={2}
                    mx={6}
                    textVariant="secondary"
                    label={`${formatTokenName(market.baseToken)} Vault`}
                    value={formatRewardTokenAmounts(
                      vaultRewards.length
                        ? vaultRewards
                        : accountRewardEpoch.globalEpoch
                            .totalVaultRewards(market.address)
                            .map(t => ({ ...t, amount: 0 }))
                    )}
                  />
                )
              })}
          </Collapsible>
        ) : null}
        {totalTradingRewards.length ? (
          <RowItem
            mx={6}
            my={4}
            textVariant="bodyMedium"
            label="Trading"
            value={formatRewardTokenAmounts(totalTradingRewards)}
          />
        ) : null}
        {totalOtherRewards.length ? (
          <RowItem
            mx={6}
            my={4}
            textVariant="bodyMedium"
            label={
              <Tooltip
                tooltip={
                  <Text variant="secondary" color="secondaryText">
                    You have unclaimed rewards from old reward programs.{' '}
                    <Link textVariant="secondary" showRightIcon href={VAULT_REWARDS_DOC_URL} target="_blank">
                      Learn more
                    </Link>
                  </Text>
                }
              >
                <Text variant="bodyMedium" color="secondaryText">
                  Other
                </Text>
                <Icon mt="1px" ml={1} strokeWidth={2.5} icon={IconType.Info} size={12} color="secondaryText" />
              </Tooltip>
            }
            value={formatRewardTokenAmounts(totalOtherRewards)}
          />
        ) : null}
      </ModalSection>
      <CardSeparator />
      <ModalSection>
        <RowItem mb={8} textVariant="bodyMedium" label="Total" value={formatRewardTokenAmounts(totalRewards)} />
        <TransactionButton
          network={accountRewardEpoch.lyra.network}
          transactionType={TransactionType.ClaimRewards}
          label="Claim"
          isDisabled={totalRewards.every(reward => reward.amount === 0)}
          onClick={async () => {
            const tx = await getLyraSDK(accountRewardEpoch.lyra.network).claimRewards(
              accountRewardEpoch.account,
              totalRewards.map(token => token.address)
            )
            await execute(tx, TransactionType.ClaimRewards, {
              onComplete: () => {
                mutateRewardsPageData()
                onClose()
              },
            })
          }}
        />
      </ModalSection>
    </Modal>
  )
}

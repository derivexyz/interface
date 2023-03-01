import CardSeparator from '@lyra/ui/components/Card/CardSeparator'
import Collapsible from '@lyra/ui/components/Collapsible'
import Flex from '@lyra/ui/components/Flex'
import Icon, { IconType } from '@lyra/ui/components/Icon'
import Modal from '@lyra/ui/components/Modal'
import ModalSection from '@lyra/ui/components/Modal/ModalSection'
import Text from '@lyra/ui/components/Text'
import { AccountRewardEpoch } from '@lyrafinance/lyra-js'
import React from 'react'
import { useState } from 'react'

import RowItem from '@/app/components/common/RowItem'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import { useMutateRewardsPageData } from '@/app/hooks/rewards/useRewardsPageData'
import formatRewardTokenAmounts from '@/app/utils/formatRewardTokenAmounts'
import formatTokenName from '@/app/utils/formatTokenName'
import getLyraSDK from '@/app/utils/getLyraSDK'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  isOpen: boolean
  onClose: () => void
  accountRewardEpoch: AccountRewardEpoch
}

export default function ClaimModal({ accountRewardEpoch, isOpen, onClose }: Props) {
  const [isVaultExpanded, setIsVaultExpanded] = useState(false)
  const execute = useTransaction(accountRewardEpoch.lyra.network)
  const mutateRewardsPageData = useMutateRewardsPageData()
  const { tradingRewards, totalRewards } = accountRewardEpoch.claimableRewards
  const emptyVaultRewards = accountRewardEpoch.globalEpoch
    .totalVaultRewards(accountRewardEpoch.globalEpoch.markets[0].address)
    .map(t => ({ ...t, amount: 0 }))
  const emptyTradingRewards = accountRewardEpoch.globalEpoch.tradingRewards(0, 0)

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Claim Rewards" width={450} centerTitle>
      <ModalSection noPadding mb={8}>
        <Flex px={6} pt={6} mb={10}>
          <Text color="secondaryText">
            Your rewards for Vaults, Trading and Shorts are claimable all at once, which saves on transaction fees. Here
            is the breakdown of your claimable rewards for each program you are participating in.
          </Text>
        </Flex>
        <Collapsible
          isExpanded={isVaultExpanded}
          noPadding
          onClickHeader={() => setIsVaultExpanded(!isVaultExpanded)}
          header={
            <RowItem
              width="100%"
              m={6}
              textVariant="bodyLarge"
              label={'Vaults Rewards'}
              value={
                <Flex ml="auto">
                  <Text variant="bodyLarge">
                    {formatRewardTokenAmounts(
                      accountRewardEpoch.totalClaimableVaultRewards.length
                        ? accountRewardEpoch.totalClaimableVaultRewards
                        : emptyVaultRewards
                    )}
                  </Text>
                  <Icon ml={2} icon={isVaultExpanded ? IconType.ChevronUp : IconType.ChevronDown} />
                </Flex>
              }
            />
          }
        >
          {accountRewardEpoch.globalEpoch.markets
            .filter(market => market.baseToken.symbol !== 'sSOL')
            .map(market => {
              const vaultRewards = accountRewardEpoch.claimableVaultRewards(market.address)
              return (
                <RowItem
                  key={market.address}
                  my={3}
                  mx={6}
                  label={`${formatTokenName(market.baseToken)} · ${getNetworkDisplayName(market.lyra.network)}`}
                  value={formatRewardTokenAmounts(
                    vaultRewards.length
                      ? vaultRewards
                      : accountRewardEpoch.globalEpoch.totalVaultRewards(market.address).map(t => ({ ...t, amount: 0 }))
                  )}
                />
              )
            })}
        </Collapsible>
        <RowItem
          mx={6}
          my={6}
          textVariant="bodyLarge"
          label="Trading Rewards"
          value={formatRewardTokenAmounts(tradingRewards.length ? tradingRewards : emptyTradingRewards)}
        />
      </ModalSection>
      <CardSeparator />
      <ModalSection>
        <Flex my={6} alignItems="center">
          <Text color="secondaryText">Total</Text>
          <Text ml="auto">{formatRewardTokenAmounts(totalRewards)}</Text>
        </Flex>
      </ModalSection>
      <TransactionButton
        mx={6}
        mb={6}
        network={accountRewardEpoch.lyra.network}
        transactionType={TransactionType.ClaimRewards}
        label="Claim"
        isDisabled={totalRewards.every(reward => reward.amount === 0)}
        onClick={async () => {
          const tx = await getLyraSDK(accountRewardEpoch.lyra.network).claimRewards(
            accountRewardEpoch.account,
            totalRewards.map(token => token.address)
          )
          await execute(tx, {
            onComplete: () => {
              mutateRewardsPageData()
              onClose()
            },
          })
        }}
      />
    </Modal>
  )
}

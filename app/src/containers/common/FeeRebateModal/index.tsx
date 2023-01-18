import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Center from '@lyra/ui/components/Center'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import List from '@lyra/ui/components/List'
import ListItem from '@lyra/ui/components/List/ListItem'
import Modal from '@lyra/ui/components/Modal'
import Spinner from '@lyra/ui/components/Spinner'
import Text from '@lyra/ui/components/Text'
import formatBalance from '@lyra/ui/utils/formatBalance'
import formatNumber from '@lyra/ui/utils/formatNumber'
import formatPercentage from '@lyra/ui/utils/formatPercentage'
import { Network } from '@lyrafinance/lyra-js'
import React from 'react'

import { PageId } from '@/app/constants/pages'
import withSuspense from '@/app/hooks/data/withSuspense'
import useLatestRewardEpoch from '@/app/hooks/rewards/useLatestRewardEpoch'
import useNetwork from '@/app/hooks/wallet/useNetwork'
import getPagePath from '@/app/utils/getPagePath'

type Props = {
  isOpen: boolean
  onClose: () => void
  network?: Network
}

const FeeRebateModalBody = withSuspense(
  ({ onClose, network }: Props) => {
    const walletNetwork = useNetwork()
    const epochs = useLatestRewardEpoch(network ?? walletNetwork)
    const global = epochs?.global
    const account = epochs?.account
    const feeRebate = account?.tradingFeeRebate ?? global?.minTradingFeeRebate ?? 0
    const feeTiers = global?.tradingFeeRebateTiers ?? []
    const stkLyra = account?.stakedLyraBalance ?? 0
    return (
      <>
        <CardSection>
          <Flex mb={6}>
            <Text color={stkLyra > 0 ? 'primaryText' : 'secondaryText'} variant="title">
              {formatBalance(stkLyra, 'stkLYRA')}
            </Text>
            <Button
              href={getPagePath({ page: PageId.Rewards })}
              ml="auto"
              label="Stake LYRA"
              rightIcon={IconType.ArrowRight}
              variant="primary"
              onClick={onClose}
            />
          </Flex>
          <Text variant="secondary" color="secondaryText">
            Lyra's fee rebate program allows traders to earn back part of their fees as Staked LYRA and OP tokens every
            2 weeks. Traders can stake LYRA to unlock a higher fee rebate tier.
          </Text>
        </CardSection>
        <CardSection noPadding>
          <Card variant="nested" mx={6} mb={6}>
            <CardSection noPadding>
              <Flex mt={6} mx={6} mb={3}>
                <Text variant="secondaryMedium" color="secondaryText">
                  Staked LYRA
                </Text>
                <Text ml="auto" textAlign="right" variant="secondaryMedium" color="secondaryText">
                  Rebate
                </Text>
              </Flex>
              <Box mb={3} overflowY="auto">
                {/* TODO: @dappbeast fix spacing issues */}
                <List>
                  {feeTiers.map(tier => (
                    <ListItem
                      key={tier.stakedLyraCutoff}
                      label={
                        <Text
                          ml={3}
                          variant={tier.feeRebate === feeRebate ? 'secondaryMedium' : 'secondary'}
                          color={tier.feeRebate === feeRebate ? 'primaryText' : 'text'}
                        >
                          {formatNumber(tier.stakedLyraCutoff, { dps: 0 })}
                        </Text>
                      }
                      rightContent={
                        <Text
                          mr={3}
                          variant={tier.feeRebate === feeRebate ? 'secondaryMedium' : 'secondary'}
                          color={tier.feeRebate === feeRebate ? 'primaryText' : 'text'}
                        >
                          {formatPercentage(tier.feeRebate, true)}
                        </Text>
                      }
                    />
                  ))}
                </List>
              </Box>
            </CardSection>
          </Card>
        </CardSection>
      </>
    )
  },
  () => (
    <CardSection>
      <Center minHeight={500} width="100%">
        <Spinner />
      </Center>
    </CardSection>
  )
)

export default function FeeRebateModal({ isOpen, onClose, network }: Props) {
  return (
    <Modal isMobileFullscreen width={500} isOpen={isOpen} onClose={onClose} title="Fee Tiers">
      <FeeRebateModalBody network={network} onClose={onClose} isOpen={isOpen} />
    </Modal>
  )
}

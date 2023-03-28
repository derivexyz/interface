import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Link from '@lyra/ui/components/Link'
import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import ModalSection from '@lyra/ui/components/Modal/ModalSection'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { ClaimableBalanceL2 } from '@lyrafinance/lyra-js'
import React from 'react'
import { useMemo } from 'react'

import RowItem from '@/app/components/common/RowItem'
import useAccountLyraBalances from '@/app/hooks/account/useAccountLyraBalances'
import withSuspense from '@/app/hooks/data/withSuspense'

import RewardsClaimStkLyraButton from './RewardsClaimStkLyraButton'
import RewardsMigrateStkLyraButton from './RewardsMigrateStkLyraButton'

type Props = {
  claimableOptimismRewards: ClaimableBalanceL2 | null
  isOpen: boolean
  onClose: () => void
}

const RewardsClaimAndMigrateModal = withSuspense(
  ({ isOpen, onClose, claimableOptimismRewards, ...styleProps }: Props): JSX.Element => {
    const lyraBalances = useAccountLyraBalances()
    const oldStkLyraBalance = lyraBalances.optimismOldStkLyra
    const { hasClaimableOptimismRewards, claimableRewardsText } = useMemo(
      () => ({
        hasClaimableOptimismRewards:
          claimableOptimismRewards && Object.values(claimableOptimismRewards).some(balance => !balance.isZero()),
        claimableRewardsText: claimableOptimismRewards
          ? Object.entries(claimableOptimismRewards)
              .filter(([_, val]) => !val.isZero())
              .map(
                ([token, val]) =>
                  `${formatNumber(val)} ${
                    ['oldStkLyra', 'newStkLyra'].includes(token) ? 'stkLYRA' : token.toUpperCase()
                  }`
              )
              .join(', ')
          : '',
      }),
      [claimableOptimismRewards]
    )
    const hasOldStkLyra = oldStkLyraBalance.gt(0)

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          <Box>
            <Text variant="heading">
              {hasClaimableOptimismRewards ? 'Claim stkLYRA' : hasOldStkLyra ? 'Migrate stkLYRA' : 'Bridge stkLYRA'}
            </Text>
            <Text variant="secondary" color="secondaryText">
              {hasClaimableOptimismRewards ? 'Step 1/3' : hasOldStkLyra ? 'Step 2/3' : 'Step 3/3'}
            </Text>
          </Box>
        }
      >
        <ModalBody>
          <ModalSection variant="elevated" {...styleProps} noPadding>
            <Text variant="secondary" color="secondaryText" width="100%" mb={10}>
              Migrate your staked LYRA on Optimism to a new version of staked LYRA that is native to Ethereum mainnet.
              You'll need to migrate to continue to earn boosts on your vault and trading rewards. Additionally, you'll
              need to bridge your stkLYRA to mainnet to continue to earn staking rewards.{' '}
              <Link
                href="https://blog.lyra.finance/lyra-staking-l1-migration/"
                target="_blank"
                showRightIcon
                textVariant="secondary"
              >
                Learn more
              </Link>
            </Text>
            {hasClaimableOptimismRewards ? (
              <>
                <RowItem label="Claimable (Optimism)" value={claimableRewardsText} mb={10} />
                <RewardsClaimStkLyraButton claimableOptimismRewards={claimableOptimismRewards} />
              </>
            ) : hasOldStkLyra ? (
              <RewardsMigrateStkLyraButton />
            ) : (
              <Button
                label="Bridge to Mainnet"
                href="https://app.optimism.io/bridge/withdraw"
                target="_blank"
                size="lg"
                variant="primary"
              />
            )}
          </ModalSection>
        </ModalBody>
      </Modal>
    )
  }
)

export default RewardsClaimAndMigrateModal

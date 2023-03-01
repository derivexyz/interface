import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import Link from '@lyra/ui/components/Link'
import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import ModalSection from '@lyra/ui/components/Modal/ModalSection'
import Text from '@lyra/ui/components/Text'
import formatBalance from '@lyra/ui/utils/formatBalance'
import React from 'react'

import RowItem from '@/app/components/common/RowItem'
import useAccountLyraBalances from '@/app/hooks/account/useAccountLyraBalances'
import withSuspense from '@/app/hooks/data/withSuspense'
import useClaimableBalances from '@/app/hooks/rewards/useClaimableBalance'

import ClaimStkLyraButton from './ClaimStkLyraButton'
import MigrateStkLyraButton from './MigrateStkLyraButton'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const ClaimAndMigrateModal = withSuspense(({ isOpen, onClose, ...styleProps }: Props): JSX.Element => {
  const claimableBalances = useClaimableBalances()
  const lyraBalances = useAccountLyraBalances()
  const oldStkLyraBalance = lyraBalances.optimismOldStkLyra
  const hasClaimableOldStkLyra = claimableBalances.oldStkLyra.gt(0)
  const hasOldStkLyra = oldStkLyraBalance.gt(0)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <Box>
          <Text variant="heading">
            {hasClaimableOldStkLyra ? 'Claim stkLYRA' : hasOldStkLyra ? 'Migrate stkLYRA' : 'Bridge stkLYRA'}
          </Text>
          <Text variant="secondary" color="secondaryText">
            {hasClaimableOldStkLyra ? 'Step 1/3' : hasOldStkLyra ? 'Step 2/3' : 'Step 3/3'}
          </Text>
        </Box>
      }
    >
      <ModalBody>
        <ModalSection variant="elevated" {...styleProps} noPadding>
          <Text variant="secondary" color="secondaryText" width="100%" mb={6}>
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
          {hasClaimableOldStkLyra ? (
            <>
              <RowItem
                label="Claimable Rewards"
                value={formatBalance(claimableBalances.oldStkLyra, 'stkLYRA')}
                mb={6}
              />
              <ClaimStkLyraButton />
            </>
          ) : hasOldStkLyra ? (
            <MigrateStkLyraButton />
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
})

export default ClaimAndMigrateModal

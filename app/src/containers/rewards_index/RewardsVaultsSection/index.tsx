import Box from '@lyra/ui/components/Box'
import Button from '@lyra/ui/components/Button'
import { CardElement } from '@lyra/ui/components/Card'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import React from 'react'
import { useMemo } from 'react'
import { useState } from 'react'

import { Vault } from '@/app/constants/vault'

import RewardsClaimModal from '../../rewards/RewardsClaimModal'
import RewardsVaultsMarketCard from './RewardsVaultsMarketCard'

type Props = {
  vaults: Vault[]
}

const RewardsVaultsSection = ({ vaults }: Props): CardElement => {
  const [isOpen, setIsOpen] = useState(false)

  const accountRewardEpoch = useMemo(
    () =>
      vaults
        .map(vault => vault.accountRewardEpoch)
        .find(a => a != null && a.totalClaimableRewards.some(r => r.amount > 0)),
    [vaults]
  )

  return (
    <Flex flexDirection="column" mt={[6, 4]}>
      <Flex alignItems="center" px={[6, 0]} mb={5}>
        <Box>
          <Text mb={2} variant="title">
            Vaults
          </Text>
          <Text color="secondaryText">Deposit to market maker vaults to earn trading fees and rewards.</Text>
        </Box>
        {accountRewardEpoch ? (
          <>
            <Box ml="auto">
              <Button onClick={() => setIsOpen(true)} width={150} label="Claim All" variant="primary" size="lg" />
            </Box>
            <RewardsClaimModal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              accountRewardEpoch={accountRewardEpoch}
            />
          </>
        ) : null}
      </Flex>
      <Flex flexDirection="column">
        {vaults.map(vault => (
          <RewardsVaultsMarketCard key={vault.market.address} vault={vault} />
        ))}
      </Flex>
    </Flex>
  )
}

export default RewardsVaultsSection

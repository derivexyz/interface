import Button from '@lyra/ui/components/Button'
import DropdownButton from '@lyra/ui/components/Button/DropdownButton'
import DropdownButtonListItem from '@lyra/ui/components/Button/DropdownButtonListItem'
import Flex from '@lyra/ui/components/Flex'
import Grid from '@lyra/ui/components/Grid'
import { IconType } from '@lyra/ui/components/Icon'
import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import Text from '@lyra/ui/components/Text'
import formatBalance from '@lyra/ui/utils/formatBalance'
import React from 'react'
import { useState } from 'react'
import { useMemo } from 'react'

import { AppNetwork, LyraNetwork } from '@/app/constants/networks'
import { LyraBalances } from '@/app/utils/common/fetchLyraBalances'
import { getLyraBalanceForNetwork } from '@/app/utils/common/getLyraBalanceForNetwork'
import getNetworkConfig from '@/app/utils/getNetworkConfig'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'

import NetworkImage from '../../common/NetworkImage'
import RowItem from '../../common/RowItem'

type Props = {
  balances: LyraBalances
  isOpen: boolean
  onClose: () => void
  isStkLYRA?: boolean
}

const getBalance = (balances: LyraBalances, network: LyraNetwork): number => {
  switch (network) {
    case LyraNetwork.Arbitrum:
      return getLyraBalanceForNetwork(balances, AppNetwork.Arbitrum)
    case LyraNetwork.Optimism:
      return getLyraBalanceForNetwork(balances, AppNetwork.Optimism)
  }
}

export default function RewardsBridgeModal({ balances, isOpen, onClose }: Props) {
  const [isDropdownOpen, setIsDrodpownOpen] = useState(false)

  const networks = useMemo(
    () => Object.values(LyraNetwork).filter(network => getBalance(balances, network) > 0),
    [balances]
  )
  const defaultNetwork = networks[0]

  const [network, setNetwork] = useState(defaultNetwork)

  if (!defaultNetwork) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bridge LYRA">
      <ModalBody>
        <Text color="secondaryText" mb={8}>
          Bridge your LYRA balance to Ethereum mainnet to stake and earn boosts on your trading and vault rewards. The
          fast bridge will send your LYRA immediately with a fee while the slow bridge will send your LYRA after 7 days.
        </Text>
        <RowItem
          mb={6}
          label={
            <Flex alignItems="center">
              <NetworkImage size={24} network={AppNetwork.Ethereum} />
              <Text ml={2}>{getNetworkDisplayName(AppNetwork.Ethereum)}</Text>
            </Flex>
          }
          value={formatBalance({
            amount: getLyraBalanceForNetwork(balances, AppNetwork.Ethereum),
            symbol: 'LYRA',
            decimals: 18,
          })}
        />
        <RowItem
          mb={8}
          label={
            networks.length > 1 ? (
              <DropdownButton
                mobileTitle="Select Network"
                label={getNetworkDisplayName(network)}
                leftIcon={<NetworkImage size={24} network={network} />}
                isOpen={isDropdownOpen}
                onClick={() => setIsDrodpownOpen(true)}
                onClose={() => setIsDrodpownOpen(false)}
              >
                {networks.map(network => (
                  <DropdownButtonListItem
                    icon={<NetworkImage size={24} network={network} />}
                    onClick={() => {
                      setNetwork(network)
                      setIsDrodpownOpen(false)
                    }}
                    key={network}
                    label={getNetworkDisplayName(network)}
                  />
                ))}
              </DropdownButton>
            ) : (
              <Flex alignItems="center">
                <NetworkImage size={24} network={network} />
                <Text ml={2}>{getNetworkDisplayName(network)}</Text>
              </Flex>
            )
          }
          value={formatBalance({
            amount: getBalance(balances, network),
            symbol: 'LYRA',
            decimals: 18,
          })}
        />
        <Grid sx={{ gridTemplateColumns: '1fr 1fr', gridGap: 3 }}>
          <Button
            size="lg"
            href={getNetworkConfig(network).nativeBridgeUrl}
            target="_blank"
            label="Bridge"
            rightIcon={IconType.ArrowUpRight}
          />
          <Button
            size="lg"
            variant="primary"
            href={getNetworkConfig(network).fastBridgeUrl}
            target="_blank"
            label="Fast Bridge"
            rightIcon={IconType.ArrowUpRight}
          />
        </Grid>
      </ModalBody>
    </Modal>
  )
}

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
import { AccountLyraBalances } from '@lyrafinance/lyra-js'
import { BigNumber } from 'ethers'
import React from 'react'
import { useState } from 'react'
import { useMemo } from 'react'

import { AppNetwork, LyraNetwork } from '@/app/constants/networks'
import getNetworkConfig from '@/app/utils/getNetworkConfig'
import getNetworkDisplayName from '@/app/utils/getNetworkDisplayName'

import NetworkImage from '../../common/NetworkImage'
import RowItem from '../../common/RowItem'

type Props = {
  balances: AccountLyraBalances
  isOpen: boolean
  onClose: () => void
  isStkLYRA?: boolean
}

const getBalance = (balances: AccountLyraBalances, network: LyraNetwork, isStkLYRA: boolean): BigNumber => {
  switch (network) {
    case LyraNetwork.Arbitrum:
      return isStkLYRA ? balances.arbitrumStkLyra : balances.arbitrumLyra
    case LyraNetwork.Optimism:
      return isStkLYRA ? balances.optimismStkLyra : balances.optimismLyra
  }
}

export default function RewardsBridgeModal({ balances, isOpen, onClose, isStkLYRA = false }: Props) {
  const [isDropdownOpen, setIsDrodpownOpen] = useState(false)

  const networks = useMemo(
    () => Object.values(LyraNetwork).filter(network => getBalance(balances, network, isStkLYRA).gt(0)),
    [balances, isStkLYRA]
  )
  const defaultNetwork = networks[0]

  const [network, setNetwork] = useState(defaultNetwork)

  if (!defaultNetwork) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Bridge ${isStkLYRA ? 'stkLYRA' : 'LYRA'}`} centerTitle>
      <ModalBody>
        <Text color="secondaryText" textAlign="center" mb={8}>
          {isStkLYRA
            ? 'Bridge your stkLYRA balance to Ethereum mainnet to earn staking rewards and boosts on your trading and vault rewards. The slow bridge will send your stkLYRA after 7 days.'
            : `Bridge your LYRA balance to Ethereum mainnet to stake and earn boosts on your trading and vault rewards. 
                The fast bridge will send your LYRA immediately with a fee while the slow bridge will send your LYRA after 7 days.`}
        </Text>
        <RowItem
          mb={6}
          textVariant="body"
          label={
            <Flex alignItems="center">
              <NetworkImage size={24} network={AppNetwork.Ethereum} />
              <Text ml={2}>{getNetworkDisplayName(AppNetwork.Ethereum)}</Text>
            </Flex>
          }
          value={formatBalance({
            amount: isStkLYRA ? balances.ethereumStkLyra : balances.ethereumLyra,
            symbol: isStkLYRA ? 'stkLYRA' : 'LYRA',
            decimals: 18,
          })}
        />
        <RowItem
          mb={8}
          textVariant="body"
          label={
            networks.length > 1 ? (
              <DropdownButton
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
            amount: getBalance(balances, network, isStkLYRA),
            symbol: isStkLYRA ? 'stkLYRA' : 'LYRA',
            decimals: 18,
          })}
        />
        <Grid sx={{ gridTemplateColumns: !isStkLYRA ? '1fr 1fr' : '1fr', gridGap: 3 }}>
          <Button
            size="lg"
            variant={!isStkLYRA ? 'default' : 'primary'}
            href={getNetworkConfig(network).nativeBridgeUrl}
            target="_blank"
            label="Bridge"
            rightIcon={IconType.ArrowUpRight}
          />
          {!isStkLYRA ? (
            <Button
              size="lg"
              variant="primary"
              href={getNetworkConfig(network).fastBridgeUrl}
              target="_blank"
              label="Fast Bridge"
              rightIcon={IconType.ArrowUpRight}
            />
          ) : null}
        </Grid>
      </ModalBody>
    </Modal>
  )
}

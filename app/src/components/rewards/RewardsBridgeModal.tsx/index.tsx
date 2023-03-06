import Button from '@lyra/ui/components/Button'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import Modal from '@lyra/ui/components/Modal'
import ModalBody from '@lyra/ui/components/Modal/ModalBody'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import { AccountLyraBalances, Chain } from '@lyrafinance/lyra-js'
import React from 'react'

import getNetworkConfig from '@/app/utils/getNetworkConfig'

import RowItem from '../../common/RowItem'

type Props = {
  balances: AccountLyraBalances
  isOpen: boolean
  onClose: () => void
  isStkLYRA?: boolean
}

export default function RewardsBridgeModal({ balances, isOpen, onClose, isStkLYRA = false }: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Bridge ${isStkLYRA ? 'stkLYRA' : 'LYRA'}`} centerTitle>
      <ModalBody>
        <Text color="secondaryText" textAlign="center" mb={10}>
          {isStkLYRA
            ? 'Bridge your stkLYRA balance to Ethereum mainnet to earn staking rewards and boosts on your trading and vault rewards. The slow bridge will send your stkLYRA after 7 days.'
            : `Bridge your LYRA balance to Ethereum mainnet to stake and earn boosts on your trading and vault rewards. 
                The fast bridge will send your LYRA immediately with a fee while the slow bridge will send your LYRA after 7 days.`}
        </Text>
        <RowItem
          mb={8}
          textVariant="body"
          label="Ethereum"
          value={
            isStkLYRA
              ? `${formatNumber(balances.ethereumStkLyra)} stkLYRA`
              : `${formatNumber(balances.ethereumLyra)} LYRA`
          }
        />
        <RowItem
          mb={1}
          textVariant="body"
          label="Optimism"
          value={
            isStkLYRA
              ? `${formatNumber(balances.optimismStkLyra.add(balances.optimismOldStkLyra))} stkLYRA`
              : `${formatNumber(balances.optimismLyra)} LYRA`
          }
        />
        <Flex ml="auto">
          <Button
            size="sm"
            variant="light"
            href={getNetworkConfig(Chain.Optimism).nativeBridgeUrl}
            target="_blank"
            label="Native Bridge"
            rightIcon={IconType.ArrowUpRight}
          />
          {!isStkLYRA ? (
            <Button
              ml={2}
              size="sm"
              variant="light"
              href={getNetworkConfig(Chain.Optimism).fastBridgeUrl}
              target="_blank"
              label="Fast Bridge"
              rightIcon={IconType.ArrowUpRight}
            />
          ) : null}
        </Flex>

        <RowItem
          mt={8}
          mb={1}
          textVariant="body"
          label="Arbitrum"
          value={
            isStkLYRA
              ? `${formatNumber(balances.arbitrumStkLyra)} stkLYRA`
              : `${formatNumber(balances.arbitrumLyra)} LYRA`
          }
        />
        <Flex ml="auto">
          <Button
            size="sm"
            variant="light"
            href={getNetworkConfig(Chain.Arbitrum).nativeBridgeUrl}
            target="_blank"
            label="Native Bridge"
            rightIcon={IconType.ArrowUpRight}
          />
          {!isStkLYRA ? (
            <Button
              ml={2}
              size="sm"
              variant="light"
              href={getNetworkConfig(Chain.Arbitrum).fastBridgeUrl}
              target="_blank"
              label="Fast Bridge"
              rightIcon={IconType.ArrowUpRight}
            />
          ) : null}
        </Flex>
      </ModalBody>
    </Modal>
  )
}

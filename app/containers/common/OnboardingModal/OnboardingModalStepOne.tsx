import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import ToggleButtonItem from '@lyra/ui/components/Button/ToggleButtonItem'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import React, { useState } from 'react'

import { EthereumChainId } from '@/app/constants/networks'
import { SOCKET_NATIVE_TOKEN_ADDRESS } from '@/app/constants/token'

import SocketBridge from '../../../components/common/SocketBridge'
import { OnboardingMethod } from '.'
import OnboardingModalCardGrid from './OnboardingModalCardGrid'
import OnboardingModalExchangeGrid from './OnboardingModalExchangeGrid'

type Props = {
  defaultToggle?: OnboardingMethod
  defaultSourceToken?: string
  defaultDestToken?: string
  defaultSourceNetwork?: number
}

export default function OnboardingModalStepOne({
  defaultToggle = OnboardingMethod.Bridge,
  defaultDestToken,
}: Props): JSX.Element {
  const [onboardingMethod, setOnboardingMethod] = useState(defaultToggle)
  const isMobile = useIsMobile()
  return (
    <>
      <Text variant="secondary" color="secondaryText" mx={8} my={6}>
        You need ETH to transact on Optimism. You can bridge ETH from another network, transfer ETH from an exchange or
        buy ETH by card.
      </Text>
      <Flex mx={8} mb={6}>
        <ToggleButton>
          {[
            { label: 'Bridge', id: OnboardingMethod.Bridge },
            { label: 'Exchange', id: OnboardingMethod.Exchange },
            { label: 'Card', id: OnboardingMethod.Card },
          ].map(item => (
            <ToggleButtonItem
              key={item.id}
              id={item.id}
              label={item.label}
              isSelected={onboardingMethod === item.id}
              onSelect={val => setOnboardingMethod(val)}
            />
          ))}
        </ToggleButton>
      </Flex>
      {onboardingMethod === OnboardingMethod.Bridge ? (
        <Flex mx={isMobile ? 4 : 8} mb={6}>
          <SocketBridge
            title={'Bridge'}
            defaultSourceToken={SOCKET_NATIVE_TOKEN_ADDRESS}
            defaultDestToken={defaultDestToken}
            defaultSourceNetwork={EthereumChainId.Mainnet}
          />
        </Flex>
      ) : null}
      {onboardingMethod === OnboardingMethod.Exchange ? (
        <Flex mx={8} mb={6}>
          <OnboardingModalExchangeGrid />
        </Flex>
      ) : null}
      {onboardingMethod === OnboardingMethod.Card ? (
        <Flex mx={8} mb={6}>
          <OnboardingModalCardGrid />{' '}
        </Flex>
      ) : null}
    </>
  )
}

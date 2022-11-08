import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import ToggleButtonItem from '@lyra/ui/components/Button/ToggleButtonItem'
import Flex from '@lyra/ui/components/Flex'
import Text from '@lyra/ui/components/Text'
import useIsMobile from '@lyra/ui/hooks/useIsMobile'
import { TokenInfo } from '@uniswap/token-lists'
import React, { useState } from 'react'

import SocketBridge from '../../../components/common/SocketBridge'
import { OnboardingMethod } from '.'

type Props = {
  title?: string
  defaultToggle?: OnboardingMethod
  defaultSourceToken?: string
  defaultDestToken?: string
  defaultSourceNetwork?: number
  toToken?: TokenInfo | null
}

const OnboardingModalPrompt = ({ toToken }: Props) => {
  return (
    <>
      {!toToken || ['susd', 'usdc', 'dai'].includes(toToken?.symbol.toLowerCase()) ? (
        <Text variant="secondary" color="secondaryText" mx={8} my={6}>
          You need stables to trade on Lyra. Swap to {toToken?.symbol} to make your first trade.
        </Text>
      ) : (
        <Text variant="secondary" color="secondaryText" mx={8} my={6}>
          You need Synthetic {toToken.symbol.substring(1)} to collateralize covered calls on Lyra. Swap to{' '}
          {toToken?.symbol} to sell a covered call.
        </Text>
      )}
    </>
  )
}

export default function OnboardingModalStepTwo({ defaultToggle = OnboardingMethod.Swap, toToken }: Props): JSX.Element {
  const [onboardingMethod, setOnboardingMethod] = useState(defaultToggle)
  const isMobile = useIsMobile()
  return (
    <>
      <OnboardingModalPrompt toToken={toToken} />
      <Flex mx={8} mb={6}>
        <ToggleButton>
          {[
            { label: 'Swap', id: OnboardingMethod.Swap },
            { label: 'Bridge', id: OnboardingMethod.Bridge },
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
          <SocketBridge title={'Bridge'} defaultDestToken={toToken?.address} />
        </Flex>
      ) : null}
      {onboardingMethod === OnboardingMethod.Swap ? (
        <Flex mx={isMobile ? 4 : 8} mb={6}>
          <SocketBridge title={'Swap'} defaultDestToken={toToken?.address} enableRefuel={false} />
        </Flex>
      ) : null}
    </>
  )
}

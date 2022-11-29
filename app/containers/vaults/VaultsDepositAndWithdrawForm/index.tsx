import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import ToggleButtonItem, { ToggleButtonItemProps } from '@lyra/ui/components/Button/ToggleButtonItem'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Center from '@lyra/ui/components/Center'
import Text from '@lyra/ui/components/Text'
import React from 'react'

import VaultsDepositForm from '../VaultsDepositForm'
import VaultsWithdrawForm from '../VaultsWithdrawForm'

type Props = {
  marketAddressOrName: string
  isDeposit: boolean
  onToggleDeposit: (isDeposit: boolean) => void
}

const VAULTS_FORM_TOGGLE: Pick<ToggleButtonItemProps, 'id' | 'label'>[] = [
  {
    id: 0,
    label: 'Deposit',
  },
  {
    id: 1,
    label: 'Withdraw',
  },
]

const VaultsDepositAndWithdrawForm = ({ marketAddressOrName, isDeposit, onToggleDeposit }: Props) => {
  if (marketAddressOrName.toLowerCase() === 'sol') {
    return (
      <>
        <Text mx={6} mt={6} variant="heading2">
          Withdraw
        </Text>
        <VaultsWithdrawForm minHeight={236} marketAddressOrName={marketAddressOrName} />
      </>
    )
  }
  return (
    <>
      <CardSection noPadding px={6} pt={6}>
        <Center>
          <ToggleButton>
            {VAULTS_FORM_TOGGLE.map(item => {
              return (
                <ToggleButtonItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  isSelected={isDeposit ? item.id === 0 : item.id === 1}
                  onSelect={val => onToggleDeposit(val === 0)}
                />
              )
            })}
          </ToggleButton>
        </Center>
      </CardSection>
      {isDeposit ? (
        <VaultsDepositForm minHeight={236} marketAddressOrName={marketAddressOrName} />
      ) : (
        <VaultsWithdrawForm minHeight={236} marketAddressOrName={marketAddressOrName} />
      )}
    </>
  )
}

export default VaultsDepositAndWithdrawForm

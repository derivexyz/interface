import { ToggleButtonItemProps } from '@lyra/ui/components/Button/ToggleButton'
import ToggleButton from '@lyra/ui/components/Button/ToggleButton'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Center from '@lyra/ui/components/Center'
import React from 'react'

import VaultsDepositForm from '../VaultsDepositForm'
import VaultsWithdrawForm from '../VaultsWithdrawForm'

type Props = {
  marketAddressOrName: string
  isDeposit: boolean
  onToggleDeposit: (isDeposit: boolean) => void
}

const VAULTS_FORM_TOGGLE: ToggleButtonItemProps[] = [
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
  return (
    <>
      <CardSection noPadding px={6} pt={6}>
        <Center>
          <ToggleButton
            items={VAULTS_FORM_TOGGLE}
            selectedItemId={isDeposit ? 0 : 1}
            onChange={val => onToggleDeposit(val === 0)}
          />
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

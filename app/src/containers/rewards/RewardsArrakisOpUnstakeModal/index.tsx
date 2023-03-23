import Button from '@lyra/ui/components/Button'
import CardBody from '@lyra/ui/components/Card/CardBody'
import Flex from '@lyra/ui/components/Flex'
import { IconType } from '@lyra/ui/components/Icon'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Modal from '@lyra/ui/components/Modal'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React, { useState } from 'react'
import { useCallback } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { ARRAKIS_OP_LIQUIDITY_URL } from '@/app/constants/links'
import { AppNetwork } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { useMutateArrakisOpStaking } from '@/app/hooks/rewards/useArrakisOpStakingAccount'
import { ArrakisOpStaking } from '@/app/utils/rewards/fetchArrakisOptimismAccount'
import unstakeArrakisOpLPToken from '@/app/utils/rewards/unstakeArrakisOpLPToken'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  isOpen: boolean
  arrakisOpStaking: ArrakisOpStaking | null
  onClose: () => void
}

export default function RewardsArrakisOpUnstakeModal({ isOpen, arrakisOpStaking, onClose }: Props) {
  const [amount, setAmount] = useState(ZERO_BN)
  const mutateArrakisOpStaking = useMutateArrakisOpStaking()
  const execute = useTransaction(AppNetwork.Optimism)
  const account = useWalletAccount()
  const isDisabled = amount.isZero() || arrakisOpStaking?.stakedLPTokenBalance.isZero()

  const handleClickUnstake = useCallback(async () => {
    if (account) {
      const tx = await unstakeArrakisOpLPToken(account, amount)
      execute(tx, TransactionType.UnstakeArrakisOpLPToken, {
        onComplete: async () => {
          await mutateArrakisOpStaking()
          onClose()
          setAmount(ZERO_BN)
        },
      })
    }
  }, [account, amount, execute, mutateArrakisOpStaking, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unstake L2 WETH/LYRA">
      <CardBody>
        <Flex mb={4} alignItems="center">
          <Text color="secondaryText">Staked Balance</Text>
          <Text ml="auto">{formatNumber(arrakisOpStaking?.stakedLPTokenBalance ?? 0)} LP Tokens</Text>
        </Flex>
        <Flex mb={8} alignItems="center">
          <Text color="secondaryText">Amount to Unstake</Text>
          <BigNumberInput
            ml="auto"
            textAlign="right"
            width="50%"
            value={amount}
            onChange={val => setAmount(val)}
            max={arrakisOpStaking?.stakedLPTokenBalance}
            showMaxButton
          />
        </Flex>
        <TransactionButton
          network={AppNetwork.Optimism}
          transactionType={TransactionType.UnstakeArrakisOpLPToken}
          width="100%"
          mb={3}
          isDisabled={isDisabled}
          label="Unstake"
          onClick={handleClickUnstake}
        />
        <Button
          width="100%"
          label="Remove Liquidity"
          rightIcon={IconType.ArrowUpRight}
          size="lg"
          href={ARRAKIS_OP_LIQUIDITY_URL + '/remove'} // TODO: @dillon LEAP-44 update this link
          target="_blank"
        />
      </CardBody>
    </Modal>
  )
}

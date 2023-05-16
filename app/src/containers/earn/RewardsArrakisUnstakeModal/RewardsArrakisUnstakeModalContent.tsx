import { BigNumber } from '@ethersproject/bignumber'
import Button from '@lyra/ui/components/Button'
import { IconType } from '@lyra/ui/components/Icon'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React, { useCallback } from 'react'
import { Flex } from 'rebass'

import { ARRAKIS_LIQUIDITY_URL } from '@/app/constants/links'
import { AppNetwork } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { useMutateArrakisStaking } from '@/app/hooks/rewards/useArrakisStaking'
import { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'
import { unstakeArrakisLPToken } from '@/app/utils/rewards/unstakeArrakisLPToken'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  amount: BigNumber
  arrakisStaking: ArrakisStaking
  onChange: (val: BigNumber) => void
  onUnstake: () => void
}

const RewardsArrakisUnstakeModalContent = ({ amount, arrakisStaking, onChange, onUnstake }: Props) => {
  const mutateArrakisStakingAccount = useMutateArrakisStaking()
  const execute = useTransaction(AppNetwork.Ethereum)
  const account = useWalletAccount()
  const isDisabled = amount.isZero() || arrakisStaking.stakedLPTokenBalance.isZero()

  const handleClickUnstake = useCallback(async () => {
    if (account) {
      const tx = await unstakeArrakisLPToken(account, amount)
      execute(tx, TransactionType.UnstakeArrakisLPToken, {
        onComplete: () => {
          mutateArrakisStakingAccount()
          onUnstake()
        },
      })
    }
  }, [account, amount, execute, mutateArrakisStakingAccount, onUnstake])

  return (
    <>
      <Flex mb={4} alignItems="center">
        <Text color="secondaryText">Staked Balance</Text>
        <Text ml="auto">{formatNumber(arrakisStaking.stakedLPTokenBalance)} LP Tokens</Text>
      </Flex>
      <Flex mb={8} alignItems="center">
        <Text color="secondaryText">Amount to Unstake</Text>
        <BigNumberInput
          ml="auto"
          textAlign="right"
          width="50%"
          value={amount}
          onChange={onChange}
          max={arrakisStaking.stakedLPTokenBalance}
          showMaxButton
        />
      </Flex>
      <TransactionButton
        network={AppNetwork.Ethereum}
        transactionType={TransactionType.UnstakeArrakisLPToken}
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
        href={ARRAKIS_LIQUIDITY_URL}
        target="_blank"
      />
    </>
  )
}

export default RewardsArrakisUnstakeModalContent

import { BigNumber } from '@ethersproject/bignumber'
import Button from '@lyra/ui/components/Button'
import { IconType } from '@lyra/ui/components/Icon'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Text from '@lyra/ui/components/Text'
import formatNumber from '@lyra/ui/utils/formatNumber'
import React, { useCallback } from 'react'
import { Flex } from 'rebass'

import { ContractId } from '@/app/constants/contracts'
import { ARRAKIS_LIQUIDITY_URL } from '@/app/constants/links'
import { AppNetwork } from '@/app/constants/networks'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import { useMutateArrakisStaking } from '@/app/hooks/rewards/useArrakisStaking'
import getContract from '@/app/utils/common/getContract'
import approveArrakisLPTokenStaking from '@/app/utils/rewards/approveArrakisLPTokenStaking'
import { ArrakisStaking } from '@/app/utils/rewards/fetchArrakisStaking'
import { stakeArrakisLPToken } from '@/app/utils/rewards/stakeArrakisLPToken'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  arrakisStaking: ArrakisStaking
  amount: BigNumber
  onChange: (val: BigNumber) => void
  onStake: () => void
}

const RewardsArrakiStakeModalContent = ({ arrakisStaking, amount, onChange, onStake }: Props) => {
  const mutateArrakisStaking = useMutateArrakisStaking()
  const execute = useTransaction(AppNetwork.Ethereum)
  const account = useWalletAccount()
  const arrakisContract = getContract(ContractId.ArrakisPoolL1, AppNetwork.Ethereum)
  const isApprove = arrakisStaking.unstakedLPTokenBalance.gt(0) && arrakisStaking.allowance.lt(amount)
  const isDisabled = amount.lte(0) || arrakisStaking.unstakedLPTokenBalance.eq(0)

  const handleClickStake = useCallback(async () => {
    if (account) {
      const tx = await stakeArrakisLPToken(account, amount)
      await execute(tx, TransactionType.StakeArrakisLPToken, {
        onComplete: async () => {
          await mutateArrakisStaking()
          onStake()
        },
      })
    }
  }, [account, amount, execute, mutateArrakisStaking, onStake])

  const handleClickApprove = useCallback(async () => {
    if (account) {
      const tx = await approveArrakisLPTokenStaking(account)
      execute(tx, TransactionType.StakeArrakisLPToken, {
        onComplete: async () => {
          await mutateArrakisStaking()
        },
      })
    }
  }, [account, execute, mutateArrakisStaking])

  return (
    <>
      <Flex mb={4} alignItems="center">
        <Text color="secondaryText">Stakeable Balance</Text>
        <Text ml="auto">{formatNumber(arrakisStaking.unstakedLPTokenBalance)} LP Tokens</Text>
      </Flex>
      <Flex mb={8} alignItems="center">
        <Text color="secondaryText">Amount to Stake</Text>
        <BigNumberInput
          ml="auto"
          textAlign="right"
          width="50%"
          value={amount}
          onChange={onChange}
          max={arrakisStaking.unstakedLPTokenBalance}
          showMaxButton
        />
      </Flex>
      <Button
        width="100%"
        label="Add Liquidity"
        rightIcon={IconType.ArrowUpRight}
        size="lg"
        variant={arrakisStaking.unstakedLPTokenBalance.gt(0) ? 'default' : 'primary'}
        href={ARRAKIS_LIQUIDITY_URL + '/add'}
        target="_blank"
        mb={3}
      />
      <TransactionButton
        network={AppNetwork.Ethereum}
        transactionType={TransactionType.StakeArrakisLPToken}
        requireAllowance={
          isApprove
            ? {
                address: arrakisContract.address,
                symbol: 'RAKIS-36',
                onClick: handleClickApprove,
                decimals: 18,
              }
            : undefined
        }
        width="100%"
        isDisabled={!isApprove && isDisabled}
        label={isApprove ? 'Allow Lyra to stake your LP Tokens' : 'Stake'}
        onClick={async () => {
          await handleClickStake()
        }}
      />
    </>
  )
}

export default RewardsArrakiStakeModalContent

import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { Network } from '@lyrafinance/lyra-js'
import React from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { TransactionType } from '@/app/constants/screen'
import withSuspense from '@/app/hooks/data/withSuspense'
import useClaimableBalances, { useMutateClaimableBalances } from '@/app/hooks/rewards/useClaimableBalance'
import useTransaction from '@/app/hooks/transaction/useTransaction'
import useWalletAccount from '@/app/hooks/wallet/useWalletAccount'
import { lyraOptimism } from '@/app/utils/lyra'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  onClaim?: () => void
}

const ClaimStkLyraButton = withSuspense(
  ({ onClaim }: Props) => {
    const owner = useWalletAccount()
    const account = lyraOptimism.account(owner ?? '')
    const execute = useTransaction(Network.Optimism)
    const mutateClaimableBalance = useMutateClaimableBalances()
    const claimableBalances = useClaimableBalances()
    const isSelectedBalanceZero = ZERO_BN.add(claimableBalances.oldStkLyra).isZero()

    const handleDistributorClaim = async () => {
      const tx = await account.claim(['0xdE48b1B5853cc63B1D05e507414D3E02831722F8'])
      await execute(tx, {
        onComplete: () => {
          mutateClaimableBalance()
          if (onClaim) {
            onClaim()
          }
        },
      })
    }

    return (
      <TransactionButton
        network={Network.Optimism}
        transactionType={TransactionType.ClaimRewards}
        width="100%"
        label="Claim"
        isDisabled={isSelectedBalanceZero}
        onClick={async () => {
          await handleDistributorClaim()
        }}
      />
    )
  },
  () => <ButtonShimmer size="lg" />
)

export default ClaimStkLyraButton

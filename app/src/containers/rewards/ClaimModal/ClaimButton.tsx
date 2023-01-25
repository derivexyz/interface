import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import { Network } from '@lyrafinance/lyra-js'
import React from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { TransactionType } from '@/app/constants/screen'
import useTransaction from '@/app/hooks/account/useTransaction'
import useWalletAccount from '@/app/hooks/account/useWalletAccount'
import useOptimismToken from '@/app/hooks/data/useOptimismToken'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccountWethLyraStaking, {
  useMutateAccountWethLyraStaking,
} from '@/app/hooks/rewards/useAccountWethLyraStaking'
import useClaimableBalances, { useMutateClaimableBalances } from '@/app/hooks/rewards/useClaimableBalance'
import filterNulls from '@/app/utils/filterNulls'
import { lyraOptimism } from '@/app/utils/lyra'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  isOpChecked: boolean
  isOldStkLyraChecked: boolean
  isNewStkLyraChecked: boolean
  isWethLyraChecked: boolean
  onClaim?: () => void
}

const ClaimButton = withSuspense(
  ({ isOpChecked, isOldStkLyraChecked, isNewStkLyraChecked, isWethLyraChecked, onClaim }: Props) => {
    const owner = useWalletAccount()
    const account = lyraOptimism.account(owner ?? '')
    const op = useOptimismToken('op')
    const stkLyra = useOptimismToken('stkLyra')
    const execute = useTransaction(Network.Optimism)
    const mutateClaimableBalance = useMutateClaimableBalances()
    const claimableBalances = useClaimableBalances()
    const wethLyraAccount = useAccountWethLyraStaking()
    const mutateWethLyraAccount = useMutateAccountWethLyraStaking()
    const isSelectedBalanceZero = ZERO_BN.add(isOpChecked ? claimableBalances.op : ZERO_BN)
      .add(isNewStkLyraChecked ? claimableBalances.newStkLyra : ZERO_BN)
      .add(isOldStkLyraChecked ? claimableBalances.oldStkLyra : ZERO_BN)
      .add(isWethLyraChecked && wethLyraAccount?.rewards.gt(0) ? wethLyraAccount?.rewards : ZERO_BN)
      .isZero()

    const handleWethLyraClaim = async () => {
      const tx = await account.claimWethLyraRewards()
      await execute(tx, {
        onComplete: () => {
          mutateWethLyraAccount()
          if (onClaim) {
            onClaim()
          }
        },
      })
    }

    const handleDistributorClaim = async () => {
      const tokens = filterNulls([
        isOpChecked ? op?.address : null,
        isNewStkLyraChecked ? stkLyra?.address : null,
        isOldStkLyraChecked ? '0xdE48b1B5853cc63B1D05e507414D3E02831722F8' : null,
      ])
      const tx = await account.claim(tokens)
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
        label={
          !isOpChecked && !isNewStkLyraChecked && !isOldStkLyraChecked && !isWethLyraChecked
            ? 'Select Rewards'
            : 'Claim'
        }
        isDisabled={isSelectedBalanceZero}
        onClick={async () => {
          if (isWethLyraChecked) {
            await handleWethLyraClaim()
            return
          }
          await handleDistributorClaim()
        }}
      />
    )
  },
  () => <ButtonShimmer size="lg" />
)

export default ClaimButton

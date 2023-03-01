import ButtonShimmer from '@lyra/ui/components/Shimmer/ButtonShimmer'
import React from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { TransactionType } from '@/app/constants/screen'
import useNetwork from '@/app/hooks/account/useNetwork'
import useTransaction from '@/app/hooks/account/useTransaction'
import useNetworkToken from '@/app/hooks/data/useNetworkToken'
import withSuspense from '@/app/hooks/data/withSuspense'
import useAccount from '@/app/hooks/market/useAccount'
import useAccountWethLyraStakingL2, {
  useMutateAccountWethLyraStakingL2,
} from '@/app/hooks/rewards/useAccountWethLyraStakingL2'
import useClaimableBalances, { useMutateClaimableBalances } from '@/app/hooks/rewards/useClaimableBalance'
import filterNulls from '@/app/utils/filterNulls'

import TransactionButton from '../../common/TransactionButton'

type Props = {
  isLyraChecked: boolean
  isOpChecked: boolean
  isOldStkLyraChecked: boolean
  isNewStkLyraChecked: boolean
  isWethLyraChecked: boolean
  onClaim?: () => void
}

const ClaimButton = withSuspense(
  ({ isOpChecked, isOldStkLyraChecked, isNewStkLyraChecked, isWethLyraChecked, isLyraChecked, onClaim }: Props) => {
    const network = useNetwork()
    const account = useAccount(network)
    const stkLyra = useNetworkToken(network, 'stkLyra')
    const op = useNetworkToken(network, 'op')
    const lyra = useNetworkToken(network, 'lyra')
    const execute = useTransaction(network)
    const mutateClaimableBalance = useMutateClaimableBalances()
    const claimableBalances = useClaimableBalances()
    const wethLyraAccount = useAccountWethLyraStakingL2()
    const mutateWethLyraAccount = useMutateAccountWethLyraStakingL2()
    const isSelectedBalanceZero = ZERO_BN.add(isOpChecked ? claimableBalances.op : ZERO_BN)
      .add(isNewStkLyraChecked ? claimableBalances.newStkLyra : ZERO_BN)
      .add(isOldStkLyraChecked ? claimableBalances.oldStkLyra : ZERO_BN)
      .add(isLyraChecked ? claimableBalances.lyra : ZERO_BN)
      .add(isWethLyraChecked && wethLyraAccount?.rewards.gt(0) ? wethLyraAccount?.rewards : ZERO_BN)
      .isZero()

    const handleWethLyraClaim = async () => {
      const tx = await account?.claimWethLyraRewardsL2()
      if (tx) {
        await execute(tx, {
          onComplete: () => {
            mutateWethLyraAccount()
            if (onClaim) {
              onClaim()
            }
          },
        })
      }
    }

    const handleDistributorClaim = async () => {
      const tokens = filterNulls([
        isOpChecked ? op?.address : null,
        isNewStkLyraChecked ? stkLyra?.address : null,
        isLyraChecked ? lyra?.address : null,
        isOldStkLyraChecked ? '0xdE48b1B5853cc63B1D05e507414D3E02831722F8' : null,
      ])
      const tx = await account?.claim(tokens)
      if (tx) {
        await execute(tx, {
          onComplete: () => {
            mutateClaimableBalance()
            if (onClaim) {
              onClaim()
            }
          },
        })
      }
    }

    return (
      <TransactionButton
        network={network}
        transactionType={TransactionType.ClaimRewards}
        width="100%"
        label={
          !isOpChecked && !isNewStkLyraChecked && !isOldStkLyraChecked && !isWethLyraChecked && !isLyraChecked
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

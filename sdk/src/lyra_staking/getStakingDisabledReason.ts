import { BigNumber } from 'ethers'

import { ZERO_BN } from '../constants/bn'
import { StakeDisabledReason, UnstakeDisabledReason } from '.'

const getStakingDisabledReason = ({
  isUnstake,
  allowance,
  amount,
  lyraBalance,
  stakedLyraBalance,
  isInUnstakeWindow,
}: {
  isUnstake: boolean
  allowance: BigNumber
  amount: BigNumber
  lyraBalance: BigNumber
  stakedLyraBalance: BigNumber
  isInUnstakeWindow: boolean
}): StakeDisabledReason | UnstakeDisabledReason | null => {
  let disabledReason
  if (isUnstake) {
    // Determine disabled reason
    if (!isInUnstakeWindow) {
      disabledReason = UnstakeDisabledReason.NotInUnstakeWindow
    } else if (amount.gt(stakedLyraBalance)) {
      disabledReason = UnstakeDisabledReason.InsufficientBalance
    } else if (amount.eq(ZERO_BN)) {
      disabledReason = UnstakeDisabledReason.ZeroAmount
    } else {
      disabledReason = null
    }
    return disabledReason
  }
  // Determine disabled reason
  if (amount.gt(lyraBalance)) {
    disabledReason = StakeDisabledReason.InsufficientBalance
  } else if (amount.gt(allowance)) {
    disabledReason = StakeDisabledReason.InsufficientAllowance
  } else if (amount.eq(ZERO_BN)) {
    disabledReason = StakeDisabledReason.ZeroAmount
  } else {
    disabledReason = null
  }
  return disabledReason
}

export default getStakingDisabledReason

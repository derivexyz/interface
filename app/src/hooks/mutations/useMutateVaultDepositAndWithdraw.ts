import { useCallback } from 'react'

import { useMutateEarnPageData } from '../rewards/useEarnPageData'

export default function useMutateVaultDepositAndWithdraw() {
  const mutateEarnPageData = useMutateEarnPageData()
  return useCallback(async () => {
    await mutateEarnPageData()
  }, [mutateEarnPageData])
}

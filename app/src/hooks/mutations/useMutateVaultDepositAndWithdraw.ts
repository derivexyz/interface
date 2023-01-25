import { useCallback } from 'react'

import { useMutateVaultsPageData } from '../vaults/useVaultsPageData'

export default function useMutateVaultDepositAndWithdraw() {
  const mutateVaultsPageData = useMutateVaultsPageData()
  return useCallback(async () => {
    await mutateVaultsPageData()
  }, [mutateVaultsPageData])
}

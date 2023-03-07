import { useCallback } from 'react'

import { useMutateAccountBalances } from '../account/useAccountBalances'
import useNetwork from '../account/useNetwork'
import { useMutateFaucetPageData } from '../faucet/useFaucetPageData'

export default function useMutateDrip() {
  const network = useNetwork()
  const mutateFaucetPageData = useMutateFaucetPageData()
  const mutateAccountBalances = useMutateAccountBalances(network)
  return useCallback(async () => {
    await Promise.all([mutateFaucetPageData(), mutateAccountBalances()])
  }, [mutateAccountBalances, mutateFaucetPageData])
}

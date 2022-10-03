import { ScreenTransactionData, ScreenTransactionResponse, TransactionType } from '@/app/constants/screen'
import isOptimismMainnet from '@/app/utils/isOptimismMainnet'
import isScreeningEnabled from '@/app/utils/isScreeningEnabled'

import useFetch from '../data/useFetch'
import useIsReady from './useIsReady'
import useWallet from './useWallet'

const fetcher = async (address: string, transactionType: TransactionType): Promise<ScreenTransactionResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/screen/transaction?address=${address}&transactionType=${transactionType}`,
    {
      method: 'GET',
      mode: 'cors',
    }
  )
  const data: ScreenTransactionResponse = await res.json()
  return data
}

const EMPTY_SCREEN_TRANSACTION: ScreenTransactionData = {
  isBlocked: false,
  blockReason: null,
  blockDescription: null,
}

export default function useScreenTransaction(transactionType: TransactionType): ScreenTransactionData {
  const { account } = useWallet()
  const isReady = useIsReady()
  const isScreenable = isReady && isOptimismMainnet() && isScreeningEnabled()
  const [data] = useFetch('ScreenTransaction', isScreenable && account ? [account, transactionType] : null, fetcher)
  if ((isScreenable && account && !data) || (data && 'error' in data)) {
    throw new Error(data?.error)
  }
  // Empty data will never be used
  return data ?? EMPTY_SCREEN_TRANSACTION
}

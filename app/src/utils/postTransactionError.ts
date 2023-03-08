import { Network } from '../constants/networks'
import { TransactionType } from '../constants/screen'
import { TransactionStage } from '../hooks/account/useTransaction'
import { getChainIdForNetwork } from './getChainIdForNetwork'

export default async function postTransactionError(
  network: Network,
  stage: TransactionStage,
  errorMessage: any,
  txName: TransactionType,
  txHash?: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/record/transaction-error?network=${network}&chain=${getChainIdForNetwork(
        network
      )}&stage=${stage}&error=${errorMessage}&hash=${txHash ?? ''}&name=${txName}`,
      {
        method: 'GET',
        mode: 'cors',
      }
    )
    return res.status === 200
  } catch (err) {
    console.warn('Failed to post transaction error')
    return false
  }
}

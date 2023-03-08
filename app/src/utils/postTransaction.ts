import { Network } from '../constants/networks'
import { getChainIdForNetwork } from './getChainIdForNetwork'

export default async function postTransaction(
  network: Network,
  txName: string,
  transactionHash: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `${
        process.env.REACT_APP_API_URL
      }/record/transaction?transactionHash=${transactionHash}&name=${txName}&network=${network}&chain=${getChainIdForNetwork(
        network
      )}`,
      {
        method: 'GET',
        mode: 'cors',
      }
    )
    return res.status === 200
  } catch (err) {
    console.warn('Failed to post transaction')
    return false
  }
}

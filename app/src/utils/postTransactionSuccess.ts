import { ContractReceipt } from 'ethers'

import { TransactionSuccessOptions } from '../hooks/account/useTransaction'
import { getChainIdForNetwork } from './getChainIdForNetwork'

export default async function postTransactionSuccess(
  receipt: ContractReceipt,
  options: TransactionSuccessOptions
): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/record/tx-success`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        txHash: receipt.transactionHash,
        txBlock: receipt.blockNumber,
        network: options.network,
        chain: getChainIdForNetwork(options.network),
        txName: options.txName,
        signer: options.signer,
        metadata: options.metadata ?? {},
      }),
    })
    return res.status === 200
  } catch (err) {
    console.warn('Failed to post transaction success')
    return false
  }
}

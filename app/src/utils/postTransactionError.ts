import { TransactionError, TransactionErrorOptions } from '../hooks/account/useTransaction'
import { getChainIdForNetwork } from './getChainIdForNetwork'

export default async function postTransactionError(
  error: TransactionError,
  options: TransactionErrorOptions
): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/record/tx-error`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({
        network: options.network,
        chain: getChainIdForNetwork(options.network),
        txName: options.txName,
        stage: options.stage,
        signer: options.signer,
        txHash: options.receipt?.transactionHash ?? '',
        txBlock: options.receipt?.blockNumber ?? '',
        metadata: options.metadata ?? {},
        code: error.code ?? '',
        message: error.message ?? '',
        data: error.data ?? '',
        description: error.description
          ? {
              name: error.description.name,
              args: error.description.args,
            }
          : {},
        reason: error.reason ?? '',
      }),
    })
    return res.status === 200
  } catch (err) {
    console.warn('Failed to post transaction error')
    return false
  }
}

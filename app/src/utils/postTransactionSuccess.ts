import { TransactionSuccessOptions } from '../hooks/account/useTransaction'

export default async function postTransactionSuccess(options: TransactionSuccessOptions): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/record/tx-success`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(options),
    })
    return res.status === 200
  } catch (err) {
    console.warn('Failed to post transaction success')
    return false
  }
}

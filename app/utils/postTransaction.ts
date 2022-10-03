export default async function postTransaction(transactionHash: string): Promise<boolean> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/record/transaction?transactionHash=${transactionHash}`, {
    method: 'GET',
    mode: 'cors',
  })
  return res.status === 200
}

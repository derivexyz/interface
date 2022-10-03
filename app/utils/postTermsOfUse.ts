export default async function postTermsOfUse(address: string): Promise<boolean> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/record/terms-of-use?address=${address}`, {
    method: 'GET',
    mode: 'cors',
  })
  return res.status === 200
}

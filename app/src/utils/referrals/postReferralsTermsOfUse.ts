export default async function postReferralsTermsOfUse(address: string): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/record/referrals-terms-of-use`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify({ address }),
    })
    return res.status === 200
  } catch (err) {
    console.warn('Failed to post transaction error')
    return false
  }
}

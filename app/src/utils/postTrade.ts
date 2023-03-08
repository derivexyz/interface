export default async function postTrade(tradeDetails: Record<string, string | number>): Promise<boolean> {
  try {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/record/trade?tradeDetails=${encodeURIComponent(JSON.stringify(tradeDetails))}`,
      {
        method: 'GET',
        mode: 'cors',
      }
    )
    return res.status === 200
  } catch (err) {
    console.warn('Failed to post trade')
    return false
  }
}

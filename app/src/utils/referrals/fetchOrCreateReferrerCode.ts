import createReferrerCode from './createReferrerCode'
import fetchReferrerCode from './fetchReferrerCode'

const fetchOrCreateReferrerCode = async (address: string): Promise<string | undefined> => {
  let referrerCode: string | undefined
  referrerCode = await fetchReferrerCode(address)
  if (referrerCode) {
    return referrerCode
  } else {
    referrerCode = await createReferrerCode(address)
  }
  return referrerCode
}

export default fetchOrCreateReferrerCode

import spindl from '@spindl-xyz/attribution-lite'

const fetchReferrerCode = async (address: string): Promise<string | undefined> => await spindl.getReferrerCode(address)

export default fetchReferrerCode

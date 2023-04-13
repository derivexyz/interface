import spindl from '@spindl-xyz/attribution-lite'

const createReferrerCode = async (address: string, code?: string): Promise<string | undefined> =>
  await spindl.createReferrerCode(address, code)

export default createReferrerCode

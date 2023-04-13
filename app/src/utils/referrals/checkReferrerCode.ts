import spindl from '@spindl-xyz/attribution-lite'

const checkReferrerCode = async (code: string): Promise<boolean> => await spindl.checkReferrerCode(code)

export default checkReferrerCode

import lyra from './lyra'

export default async function getIsOwnerMultiSig(owner: string): Promise<boolean> {
  try {
    const code = await lyra.provider.getCode(owner)
    // No contract deployed
    if (code === '0x') {
      return false
    }
  } catch (e) {
    return false
  }
  return true
}

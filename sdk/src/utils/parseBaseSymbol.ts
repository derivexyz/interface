export default function parseBaseSymbol(baseKey: string) {
  // Account for "sETH", "ETH" or "eth" formats
  // Check that key starts with "s" and rest of string is uppercase
  const parsedBasekey =
    baseKey.startsWith('s') && baseKey.substring(1).toUpperCase() === baseKey.substring(1)
      ? baseKey
      : 's' + baseKey.toUpperCase()
  return parsedBasekey
}

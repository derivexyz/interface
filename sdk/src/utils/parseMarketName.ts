export default function parseMarketName(marketName: string) {
  const [baseKey, quoteKey] = marketName.split('-')
  if (!quoteKey) {
    throw new Error(`Invalid market name arg: ${marketName}`)
  }
  return { baseKey, quoteKey }
}

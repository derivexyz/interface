export default function getMarketDisplayName(baseTokenSymbol: string | null): string {
  switch (baseTokenSymbol?.toLowerCase()) {
    case 'lylp':
    case 'eth':
    case 'seth':
    case 'seth-susd':
      return 'Ethereum'
    case 'btc':
    case 'sbtc':
    case 'sbtc-susd':
      return 'Bitcoin'
    case 'sol':
    case 'ssol':
    case 'ssol-susd':
      return 'Solana'
    default:
      return ''
  }
}

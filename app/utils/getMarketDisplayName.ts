export default function getMarketDisplayName(baseTokenSymbol: string | null): string {
  switch (baseTokenSymbol?.toLowerCase()) {
    case 'lylp':
    case 'eth':
    case 'seth':
      return 'Ethereum'
    case 'btc':
    case 'sbtc':
      return 'Bitcoin'
    case 'link':
    case 'slink':
      return 'Chainlink'
    case 'sol':
    case 'ssol':
      return 'Solana'
    case 'aave':
    case 'saave':
      return 'Aave'
    case 'avax':
    case 'savax':
      return 'Avax'
    case 'matic':
    case 'smatic':
      return 'Matic'
    case 'uni':
    case 'suni':
      return 'Uniswap'
    case 'wti':
    case 'swti':
      return 'Oil'
    default:
      return ''
  }
}

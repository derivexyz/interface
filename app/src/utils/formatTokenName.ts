type Token = {
  symbol: string
}

export default function formatTokenName(token: Token) {
  switch (token.symbol.toLowerCase()) {
    case 'weth':
      return 'ETH'
    default:
      return token.symbol
  }
}

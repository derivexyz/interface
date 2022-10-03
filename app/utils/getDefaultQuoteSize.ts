import { ONE_BN } from '../constants/bn'

export default function getDefaultQuoteSize(marketName: string) {
  switch (marketName.toLowerCase()) {
    case 'eth':
      return ONE_BN
    case 'btc':
      return ONE_BN
    default:
      return ONE_BN
  }
}

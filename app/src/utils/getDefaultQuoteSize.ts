import { ONE_BN } from '../constants/bn'

export default function getDefaultQuoteSize(marketName: string) {
  switch (marketName.toLowerCase()) {
    case 'seth-susd':
      return ONE_BN
    case 'sbtc-susd':
      return ONE_BN
    default:
      return ONE_BN
  }
}

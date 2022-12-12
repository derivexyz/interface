import { QuoteDisabledReason } from '@lyrafinance/lyra-js'

const getIsQuoteHidden = (disabledReason: QuoteDisabledReason): boolean => {
  switch (disabledReason) {
    case QuoteDisabledReason.InsufficientLiquidity:
      return false
    default:
      return true
  }
}

export default getIsQuoteHidden

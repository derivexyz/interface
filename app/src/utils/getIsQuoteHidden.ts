import { QuoteDisabledReason } from '@lyrafinance/lyra-js'

const getIsQuoteHidden = (disabledReason: QuoteDisabledReason): boolean => {
  switch (disabledReason) {
    case QuoteDisabledReason.InsufficientLiquidity:
    case QuoteDisabledReason.UnableToHedgeDelta:
    case QuoteDisabledReason.DeltaOutOfRange:
      return false
    default:
      return true
  }
}

export default getIsQuoteHidden

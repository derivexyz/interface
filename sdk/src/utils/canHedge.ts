import { UNIT } from '../constants/bn'
import { PoolHedgerView } from '../market'

export default function canHedge(increasesPoolDelta: boolean, hedgerView: PoolHedgerView) {
  const { expectedHedge, currentHedge, gmxView, futuresPoolHedgerParams } = hedgerView
  const expectedHedgeAbs = expectedHedge.abs()
  const currentHedgeAbs = currentHedge.abs()
  if (!futuresPoolHedgerParams) {
    return true
  }
  if (expectedHedgeAbs.lte(currentHedgeAbs)) {
    // Delta is shrinking (potentially flipping, but still smaller than current hedge), so we skip the check
    return true
  }

  // expected hedge is positive, and trade increases delta of the pool - risk is reduced, so accept trade
  if (increasesPoolDelta && expectedHedge.gte(0)) {
    return true
  }

  // expected hedge is negative, and trade decreases delta of the pool - risk is reduced, so accept trade
  if (!increasesPoolDelta && expectedHedge.lte(0)) {
    return true
  }

  let remainingDeltas
  if (expectedHedge.gt(0)) {
    const { basePoolAmount, baseReservedAmount } = gmxView
    // remaining is the amount of baseAsset that can be hedged
    remainingDeltas = basePoolAmount.sub(baseReservedAmount)
  } else {
    const { quotePoolAmount, quoteReservedAmount } = gmxView
    remainingDeltas = quotePoolAmount.sub(quoteReservedAmount)
  }

  const absHedgeDiff = expectedHedgeAbs.sub(currentHedgeAbs)
  if (remainingDeltas.lt(absHedgeDiff.mul(futuresPoolHedgerParams.marketDepthBuffer).div(UNIT))) {
    return false
  }

  return true
}

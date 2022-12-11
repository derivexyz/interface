import { Contract } from '@ethersproject/contracts'
import Lyra, { LyraMarketContractId, LyraMarketContractReturnType, MarketContractAddresses } from '@lyrafinance/lyra-js'

export default function getLyraMarketContractFromAddress<T extends LyraMarketContractId>(
  lyra: Lyra,
  address: string,
  marketContractAddresses: MarketContractAddresses
): { contractId: string; contract: LyraMarketContractReturnType[T] } | null {
  const keyValPair = Object.entries(marketContractAddresses).find(
    ([key, val]) => isNaN(parseInt(key)) && val === address
  )
  if (!keyValPair) {
    return null
  }
  const [key] = keyValPair
  let contractId
  switch (key) {
    case 'optionMarketPricer':
      contractId = LyraMarketContractId.OptionMarketPricer
      break
    case 'liquidityPool':
      contractId = LyraMarketContractId.LiquidityPool
      break
    case 'liquidityToken':
      contractId = LyraMarketContractId.LiquidityToken
      break
    case 'greekCache':
      contractId = LyraMarketContractId.OptionGreekCache
      break
    case 'optionMarket':
      contractId = LyraMarketContractId.OptionMarket
      break
    case 'optionToken':
      contractId = LyraMarketContractId.OptionToken
      break
    case 'shortCollateral':
      contractId = LyraMarketContractId.ShortCollateral
      break
    case 'poolHedger':
      contractId = LyraMarketContractId.PoolHedger
      break
  }
  if (!contractId) {
    return null
  }
  const abi = lyra.admin().getLyraContractABI(contractId)
  return {
    contractId,
    contract: new Contract(address, abi, lyra.provider) as unknown as LyraMarketContractReturnType[T],
  }
}

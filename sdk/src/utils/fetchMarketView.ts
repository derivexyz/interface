import { isAddress } from '@ethersproject/address'

import { LyraContractId } from '../constants/contracts'
import { MarketViewWithBoardsStructOutput } from '../constants/views'
import Lyra, { Version } from '../lyra'
import getLyraContract from './getLyraContract'
import parseBaseKeyBytes32 from './parseBaseKeyBytes32'
import parseBaseSymbol from './parseBaseSymbol'

export default async function fetchMarketView(
  lyra: Lyra,
  marketAddressOrName: string
): Promise<MarketViewWithBoardsStructOutput> {
  if (isAddress(marketAddressOrName)) {
    return await getLyraContract(lyra, lyra.version, LyraContractId.OptionMarketViewer).getMarket(marketAddressOrName)
  } else {
    const baseSymbol = parseBaseSymbol(lyra, marketAddressOrName)
    switch (lyra.version) {
      case Version.Avalon:
        return getLyraContract(lyra, lyra.version, LyraContractId.OptionMarketViewer).getMarketForBaseKey(
          parseBaseKeyBytes32(baseSymbol)
        )
      case Version.Newport:
        return getLyraContract(lyra, lyra.version, LyraContractId.OptionMarketViewer).getMarketForBase(baseSymbol)
    }
  }
}

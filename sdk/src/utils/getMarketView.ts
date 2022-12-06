import { isAddress } from '@ethersproject/address'

import { LyraContractId } from '../constants/contracts'
import { MarketViewWithBoardsStructOutput } from '../constants/views'
import { OptionMarketViewer as OptionMarketViewerAvalon } from '../contracts/avalon/typechain'
import { OptionMarketViewer } from '../contracts/newport/typechain'
import Lyra, { Version } from '../lyra'
import getLyraContract from './getLyraContract'
import parseBaseKeyBytes32 from './parseBaseKeyBytes32'
import parseBaseSymbol from './parseBaseSymbol'
import parseMarketName from './parseMarketName'

export default async function getMarketView(
  lyra: Lyra,
  marketAddressOrName: string
): Promise<MarketViewWithBoardsStructOutput> {
  const _viewer = getLyraContract(lyra, LyraContractId.OptionMarketViewer)
  if (isAddress(marketAddressOrName)) {
    return await _viewer.getMarket(marketAddressOrName)
  } else {
    const { baseKey } = parseMarketName(marketAddressOrName)
    if (lyra.version === Version.Avalon) {
      const avalonViewer = _viewer as OptionMarketViewerAvalon
      return avalonViewer.getMarketForBaseKey(parseBaseKeyBytes32(baseKey))
    }
    const viewer = _viewer as OptionMarketViewer
    const baseKeyMarket = await viewer.getMarketForBase(parseBaseSymbol(baseKey))
    return baseKeyMarket
  }
}

import { AccountLiquidityTokenBalance, Market } from '..'
import { UNIT } from '../constants/bn'
import { LyraContractId } from '../constants/contracts'
import Lyra from '../lyra'
import getLyraContract from '../utils/getLyraContract'

export default async function getLiquidityTokenBalance(
  lyra: Lyra,
  owner: string,
  market: Market
): Promise<AccountLiquidityTokenBalance> {
  const optionMarketViewer = getLyraContract(lyra.provider, lyra.deployment, LyraContractId.OptionMarketViewer)
  const [[liquidityTokenBalance], marketLiquidity] = await Promise.all([
    optionMarketViewer.getLiquidityBalancesAndAllowances([market.address], owner),
    market.liquidity(),
  ])
  return {
    market,
    address: liquidityTokenBalance.token,
    balance: liquidityTokenBalance.balance,
    value: marketLiquidity.tokenPrice.mul(liquidityTokenBalance.balance).div(UNIT),
    tokenPrice: marketLiquidity.tokenPrice,
    allowance: liquidityTokenBalance.allowance,
    // TODO: @dappbeast Add symbol and decimals to getLiquidityBalancesAndAllowances
    symbol: `Ly${market.name}LP`,
    decimals: 18,
  }
}

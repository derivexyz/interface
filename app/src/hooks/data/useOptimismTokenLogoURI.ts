import useOptimismTokenList from './useOptimismTokenList'

export default function useOptimismTokenLogoURI(tokenNameOrAddress: string): string | null {
  const optimismTokenList = useOptimismTokenList()
  const token = optimismTokenList.find(
    token =>
      token.address === tokenNameOrAddress ||
      token.symbol.toLowerCase() === tokenNameOrAddress.toLowerCase() ||
      token.name.toLowerCase() === tokenNameOrAddress.toLowerCase()
  )
  return token?.logoURI ?? null
}

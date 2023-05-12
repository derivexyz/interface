import useFontSx from './useFontSx'
import useThemeValue from './useThemeValue'

export default function useLineHeight(variant: string): number {
  const fontSize = useThemeValue(useFontSx(variant).lineHeight)
  return parseInt(fontSize.toString(), 10)
}

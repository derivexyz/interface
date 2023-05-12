import useFontSx from './useFontSx'
import useThemeValue from './useThemeValue'

export default function useFontSize(variant: string): number {
  const fontSize = useThemeValue(useFontSx(variant).fontSize)
  return parseInt(fontSize.toString(), 10)
}

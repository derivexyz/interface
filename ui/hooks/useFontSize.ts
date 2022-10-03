import theme from '../theme'
import getValue from '../utils/getValue'
import useThemeValue from './useThemeValue'

// TODO: Remove this in favor of something more reliable
export default function useFontSize(variant: string): number {
  let variantStyles = getValue(theme, ['text', variant])
  if (variantStyles?.variant != null) {
    const nestedVariant = (variantStyles.variant.toString() as string).split('.').pop()
    variantStyles = getValue(theme, ['text', nestedVariant])
  }
  const fontSizeIndex = useThemeValue(getValue(theme, ['text', variant, 'fontSize']) ?? null)
  const fontSize = getValue(theme, ['fontSizes', fontSizeIndex])
  return parseInt(fontSize, 10)
}

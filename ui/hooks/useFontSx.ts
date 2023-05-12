import theme from '../theme'
import { ResponsiveValue } from '../types'
import getValue from '../utils/getValue'

export default function useFontSx(variant: string): {
  fontFamily: string
  fontWeight: ResponsiveValue
  fontSize: ResponsiveValue
  lineHeight: ResponsiveValue
  letterSpacing: ResponsiveValue
} {
  const fontSx = getValue(theme, ['text', variant])
  return fontSx
}

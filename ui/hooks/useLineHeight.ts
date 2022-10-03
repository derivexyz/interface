import theme from '../theme'
import getVariantSX from '../utils/getVariantSX'

export default function useLineHeight(variant: string): number {
  const sx = getVariantSX(variant.startsWith('text') ? variant : 'text.' + variant)
  const lineHeight =
    theme.lineHeights && sx.lineHeight ? theme.lineHeights[sx.lineHeight.toString() as any] ?? sx.lineHeight : 0
  return parseInt(lineHeight.toString(), 10)
}

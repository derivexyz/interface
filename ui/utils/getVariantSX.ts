import { CSSObject } from 'styled-components'

import theme from '../theme'
import getValue from './getValue'

export default function getVariantSX(variant: string): CSSObject {
  return getValue(theme, variant)
}

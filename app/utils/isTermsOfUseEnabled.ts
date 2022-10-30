import isOptimismMainnet from './isOptimismMainnet'

export default function isTermsOfUseEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_TERMS_OF_USE === 'true' && isOptimismMainnet()
}

import isOptimismMainnet from './isOptimismMainnet'

export default function isTermsOfUseEnabled() {
  return process.env.REACT_APP_ENABLE_TERMS_OF_USE === 'true' && isOptimismMainnet()
}

import isMainnet from './isMainnet'

export default function isTermsOfUseEnabled() {
  return process.env.REACT_APP_ENABLE_TERMS_OF_USE === 'true' && isMainnet()
}

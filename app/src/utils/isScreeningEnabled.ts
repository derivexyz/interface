export default function isScreeningEnabled() {
  return process.env.REACT_APP_ENABLE_SCREENING === 'true'
}

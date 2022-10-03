export default function isScreeningEnabled() {
  return process.env.NEXT_PUBLIC_ENABLE_SCREENING === 'true'
}

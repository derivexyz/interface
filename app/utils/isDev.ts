export default function isDev() {
  return !process.env.NEXT_PUBLIC_ENV || process.env.NEXT_PUBLIC_ENV === 'development'
}

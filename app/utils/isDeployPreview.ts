export default function isDeployPreview() {
  return process.env.NEXT_PUBLIC_ENV === 'preview' || process.env.VERCEL_ENV === 'preview'
}

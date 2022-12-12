export default function isDeployPreview() {
  return process.env.VERCEL_ENV === 'preview'
}

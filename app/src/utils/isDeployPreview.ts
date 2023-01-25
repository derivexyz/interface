export default function isDeployPreview() {
  return process.env.REACT_APP_ENV === 'preview'
}

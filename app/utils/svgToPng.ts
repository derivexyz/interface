/**
 * converts a base64 encoded data url SVG image to a PNG image
 * @param originalBase64 data url of svg image
 * @param width target width in pixel of PNG image
 * @return {Promise<String>} resolves to png data url of the image
 */
export default function svgToPng(originalBase64: string, width: number, height: number): Promise<string | null> {
  return new Promise(resolve => {
    const img = document.createElement('img')
    img.onload = function () {
      document.body.appendChild(img)
      const canvas = document.createElement('canvas')
      document.body.removeChild(img)
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
      try {
        const data = canvas.toDataURL('image/png')
        resolve(data)
      } catch (e) {
        resolve(null)
      }
    }
    img.onerror = function () {
      resolve(null)
    }
    img.src = originalBase64
  })
}

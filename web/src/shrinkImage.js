const MAX_EDGE = 1800
const MAX_BYTES = 4 * 1024 * 1024

// VPS / hosting often limits uploads; large photos are scaled down in the browser first.
// PNG and WebP may carry transparency (cut-out portraits), so they are re-encoded as WebP.
export async function shrinkImage(file) {
  if (!file.type.startsWith('image/')) return file
  const bitmap = await createImageBitmap(file).catch(() => null)
  if (!bitmap) return file
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height))
  if (scale === 1 && file.size <= MAX_BYTES) {
    bitmap.close()
    return file
  }
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  const keepAlpha = file.type !== 'image/jpeg'
  const encode = (type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality))
  let blob = await encode(keepAlpha ? 'image/webp' : 'image/jpeg', keepAlpha ? 0.9 : 0.85)
  if (keepAlpha && blob?.type !== 'image/webp') blob = await encode('image/png')
  if (!blob || blob.size >= file.size) return file
  const ext = { 'image/webp': '.webp', 'image/jpeg': '.jpg', 'image/png': '.png' }[blob.type]
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + ext, { type: blob.type })
}

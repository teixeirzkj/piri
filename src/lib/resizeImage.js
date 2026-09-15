// Resizes an <input type="file"> image client-side and hands back a data URL
// small enough to store directly in a Supabase text/jsonb column.
export function resizeImage(file, cb, { maxWidth = 500, quality = 0.78 } = {}) {
  const reader = new FileReader()
  reader.onload = () => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      cb(canvas.toDataURL('image/jpeg', quality))
    }
    img.src = reader.result
  }
  reader.readAsDataURL(file)
}

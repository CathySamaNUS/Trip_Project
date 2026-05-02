import { useRef, useState } from 'react'
import { uid } from '../utils/id.js'

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })

// downscale large images so localStorage doesn't blow up
const compressImage = async (file, maxDim = 1280, quality = 0.82) => {
  const dataUrl = await fileToDataUrl(file)
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        const scale = Math.min(maxDim / width, maxDim / height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      try {
        resolve(canvas.toDataURL('image/jpeg', quality))
      } catch {
        resolve(dataUrl)
      }
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

export default function PhotoUploader({ photos, onChange }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)

  const handleFiles = async (files) => {
    if (!files || !files.length) return
    setBusy(true)
    try {
      const arr = Array.from(files)
      const processed = await Promise.all(
        arr.map(async (f, i) => ({
          id: uid('p'),
          url: f.type.startsWith('image/') ? await compressImage(f) : await fileToDataUrl(f),
          name: f.name,
          isCover: photos.length === 0 && i === 0
        }))
      )
      onChange([...photos, ...processed])
    } finally {
      setBusy(false)
    }
  }

  const removePhoto = (id) => {
    let next = photos.filter((p) => p.id !== id)
    if (!next.find((p) => p.isCover) && next.length) next[0].isCover = true
    onChange(next)
  }

  const setCover = (id) => {
    onChange(photos.map((p) => ({ ...p, isCover: p.id === id })))
  }

  return (
    <div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {photos.map((p) => (
          <div key={p.id} className="flex-shrink-0 group relative">
            <div className="polaroid w-28">
              <img
                src={p.url}
                alt={p.name || ''}
                className="w-24 h-24 object-cover rounded-sm"
              />
              <div className="text-center text-[10px] text-muted mt-1 truncate w-24">
                {p.isCover ? '封面' : p.name?.slice(0, 8) || '照片'}
              </div>
            </div>
            <div className="absolute inset-x-0 -bottom-1 flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition">
              {!p.isCover && (
                <button
                  type="button"
                  onClick={() => setCover(p.id)}
                  className="text-[10px] bg-white border border-[#e8dec2] rounded-full px-2 py-0.5"
                >
                  设为封面
                </button>
              )}
              <button
                type="button"
                onClick={() => removePhoto(p.id)}
                className="text-[10px] bg-white border border-[#e8dec2] rounded-full px-2 py-0.5"
              >
                删除
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex-shrink-0 w-28 h-[136px] rounded-md border-2 border-dashed border-[#e0d4b6] bg-white flex flex-col items-center justify-center text-muted hover:border-rose hover:text-rose transition disabled:opacity-50"
        >
          <div className="text-2xl">{busy ? '⏳' : '＋'}</div>
          <div className="text-xs mt-1">{busy ? '处理中' : '继续上传'}</div>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="text-xs text-muted mt-2">
        小贴士：门口、招牌、食物、人物、动物、纪念品都很好哦～
      </div>
    </div>
  )
}

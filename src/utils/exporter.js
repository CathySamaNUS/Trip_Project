import LZString from 'lz-string'

// Lazily import heavy libs only when the user actually clicks export.
const loadHtml2Canvas = () => import('html2canvas').then((m) => m.default)
const loadJsPDF = () => import('jspdf').then((m) => m.default || m.jsPDF)

// Photo placeholder used when sharing via URL (real photos are too big to fit).
export const PHOTO_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="320" viewBox="0 0 480 320">' +
      '<rect width="480" height="320" fill="#f5ead0"/>' +
      '<text x="240" y="160" text-anchor="middle" dominant-baseline="middle" font-size="48">📷</text>' +
      '<text x="240" y="220" text-anchor="middle" font-size="14" fill="#a89b80">照片未包含在分享链接中</text>' +
      '</svg>'
  )

const stripPhotosForShare = (trip) => ({
  ...trip,
  locations: (trip.locations || []).map((loc) => ({
    ...loc,
    photos: (loc.photos || []).map((p) => ({
      id: p.id,
      url: PHOTO_PLACEHOLDER,
      name: p.name || '',
      isCover: !!p.isCover
    })),
    // regenerate on receiver side from inputs
    generatedContent: null
  }))
})

export const encodeTripToShareUrl = (trip) => {
  const slim = stripPhotosForShare(trip)
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(slim))
  const base = window.location.origin + window.location.pathname
  return `${base}#share=${compressed}`
}

export const decodeTripFromHash = () => {
  const m = (window.location.hash || '').match(/^#share=(.+)$/)
  if (!m) return null
  try {
    const json = LZString.decompressFromEncodedURIComponent(m[1])
    if (!json) return null
    const trip = JSON.parse(json)
    if (!trip || !trip.id || !Array.isArray(trip.locations)) return null
    return trip
  } catch {
    return null
  }
}

export const clearShareHash = () => {
  if (window.location.hash.startsWith('#share=')) {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}

const sanitize = (name) => (name || 'journal').replace(/[\\/:*?"<>|]/g, '_').slice(0, 60)

const captureElement = async (el) => {
  const html2canvas = await loadHtml2Canvas()
  await new Promise((r) => requestAnimationFrame(r))
  return html2canvas(el, {
    backgroundColor: '#fdfaf3',
    scale: 2,
    useCORS: true,
    logging: false,
    allowTaint: false,
    imageTimeout: 15000
  })
}

const triggerDownload = (blobOrDataUrl, filename) => {
  let url = blobOrDataUrl
  let revoke = false
  if (blobOrDataUrl instanceof Blob) {
    url = URL.createObjectURL(blobOrDataUrl)
    revoke = true
  }
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  if (revoke) setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const exportPagesToPDF = async (elements, title) => {
  if (!elements?.length) throw new Error('没有可导出的页面')
  const jsPDF = await loadJsPDF()
  const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'p' })
  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const margin = 24

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i]
    if (!el) continue
    const canvas = await captureElement(el)
    const img = canvas.toDataURL('image/jpeg', 0.92)
    const ratio = Math.min(
      (pageW - margin * 2) / canvas.width,
      (pageH - margin * 2) / canvas.height
    )
    const w = canvas.width * ratio
    const h = canvas.height * ratio
    if (i > 0) pdf.addPage()
    pdf.setFillColor(253, 250, 243)
    pdf.rect(0, 0, pageW, pageH, 'F')
    pdf.addImage(img, 'JPEG', (pageW - w) / 2, (pageH - h) / 2, w, h)
  }
  pdf.save(`${sanitize(title)}.pdf`)
}

export const exportPagesToLongImage = async (elements, title) => {
  if (!elements?.length) throw new Error('没有可导出的页面')
  const canvases = []
  for (const el of elements) {
    if (!el) continue
    canvases.push(await captureElement(el))
  }
  const gap = 32
  const totalW = Math.max(...canvases.map((c) => c.width))
  const totalH = canvases.reduce((s, c) => s + c.height + gap, gap)
  const out = document.createElement('canvas')
  out.width = totalW
  out.height = totalH
  const ctx = out.getContext('2d')
  ctx.fillStyle = '#fdfaf3'
  ctx.fillRect(0, 0, totalW, totalH)
  let y = gap
  for (const c of canvases) {
    ctx.drawImage(c, (totalW - c.width) / 2, y)
    y += c.height + gap
  }
  await new Promise((resolve) => {
    out.toBlob(
      (blob) => {
        if (blob) triggerDownload(blob, `${sanitize(title)}.jpg`)
        resolve()
      },
      'image/jpeg',
      0.92
    )
  })
}

export const exportTripJSON = (trip) => {
  const payload = {
    _format: 'trip-memory@1',
    exportedAt: new Date().toISOString(),
    trip
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  triggerDownload(blob, `${sanitize(trip.tripTitle)}.json`)
}

export const importTripJSON = async (file) => {
  const text = await file.text()
  const data = JSON.parse(text)
  if (!data?.trip || data._format !== 'trip-memory@1') {
    throw new Error('不是合法的旅行手账文件')
  }
  return data.trip
}

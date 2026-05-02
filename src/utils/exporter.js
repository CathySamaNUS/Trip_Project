// Lazily import heavy libs only when the user actually clicks export.
const loadHtml2Canvas = () => import('html2canvas').then((m) => m.default)
const loadJsPDF = () => import('jspdf').then((m) => m.default || m.jsPDF)

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

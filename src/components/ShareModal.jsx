import { useState } from 'react'
import { exportPagesToPDF, exportPagesToLongImage, exportTripJSON } from '../utils/exporter.js'
import { PrimaryButton, SecondaryButton } from './Buttons.jsx'

const Option = ({ icon, title, desc, onClick, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className="w-full paper-card p-4 text-left flex items-center gap-3 hover:border-rose hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-2xl flex-shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-medium text-ink">{title}</div>
      <div className="text-xs text-muted mt-0.5">{desc}</div>
    </div>
    <div className="text-rose">›</div>
  </button>
)

export default function ShareModal({ trip, getElements, onClose }) {
  const [busy, setBusy] = useState(null) // 'pdf' | 'jpg' | 'json' | null
  const [error, setError] = useState('')

  const run = async (kind, fn) => {
    setBusy(kind)
    setError('')
    try {
      await fn()
    } catch (e) {
      console.error(e)
      setError(e?.message || '导出失败，请稍后再试')
    } finally {
      setBusy(null)
    }
  }

  const onPDF = () =>
    run('pdf', async () => {
      const els = getElements()
      await exportPagesToPDF(els, trip.tripTitle)
    })
  const onJPG = () =>
    run('jpg', async () => {
      const els = getElements()
      await exportPagesToLongImage(els, trip.tripTitle)
    })
  const onJSON = () =>
    run('json', async () => {
      exportTripJSON(trip)
    })

  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-2 md:p-6"
      onClick={onClose}
    >
      <div
        className="paper-card w-full max-w-md p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="font-serifc text-xl">分享这本手账</div>
          <button onClick={onClose} className="btn-ghost">✕</button>
        </div>
        <p className="text-sm text-muted mb-4">
          目前所有数据保存在你的浏览器里。导出 PDF / 长图可以保存或转发给朋友；导出 JSON 适合备份。
        </p>

        <div className="space-y-3">
          <Option
            icon="📄"
            title={busy === 'pdf' ? '正在生成 PDF…' : '导出 PDF'}
            desc="按目录顺序输出每一页，A4 纵向，适合保存与打印。"
            disabled={!!busy}
            onClick={onPDF}
          />
          <Option
            icon="🖼️"
            title={busy === 'jpg' ? '正在生成长图…' : '导出长图'}
            desc="把每一页竖向拼成一张图，适合发到微信/朋友圈/微博。"
            disabled={!!busy}
            onClick={onJPG}
          />
          <Option
            icon="🗂️"
            title={busy === 'json' ? '正在导出 JSON…' : '导出 JSON 备份'}
            desc="包含照片和全部输入，可以传给朋友或在另一台设备恢复。"
            disabled={!!busy}
            onClick={onJSON}
          />
        </div>

        {error && (
          <div className="mt-3 text-sm text-rose bg-rose/10 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        <div className="text-xs text-muted mt-4 leading-5">
          导出过程中会临时把整本手账渲染一遍，旅行较长时可能需要几秒。
        </div>

        <div className="mt-4 flex justify-end">
          <SecondaryButton onClick={onClose} disabled={!!busy}>关闭</SecondaryButton>
        </div>
      </div>
    </div>
  )
}

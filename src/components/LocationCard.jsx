import { useNavigate } from 'react-router-dom'

const statusMeta = (loc) => {
  if (loc.generated) return { label: '已生成', cls: 'bg-moss/40 text-[#4a6b3e]' }
  if (
    loc.memoryInput?.oneLineMemory ||
    loc.memoryInput?.memorableDetailsText ||
    loc.photos?.length
  )
    return { label: '编辑中', cls: 'bg-cream text-[#a07b1f]' }
  return { label: '未填写', cls: 'bg-paper text-muted' }
}

export default function LocationCard({ loc, onDelete }) {
  const nav = useNavigate()
  const cover = loc.photos?.find((p) => p.isCover) || loc.photos?.[0]
  const status = statusMeta(loc)
  const moods = loc.memoryInput?.moodTags?.slice(0, 3) || []

  return (
    <div className="paper-card p-3 flex gap-3 items-center">
      <div className="text-rose font-serifc text-lg w-6 text-center">{loc.order}</div>
      <div className="w-16 h-16 rounded-md overflow-hidden bg-paper flex-shrink-0 border border-[#e8dec2]">
        {cover ? (
          <img src={cover.url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted text-xs">
            无封面
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="font-medium text-ink truncate">{loc.locationName || '未命名地点'}</div>
          <span className={`text-[11px] px-2 py-0.5 rounded-full ${status.cls}`}>{status.label}</span>
        </div>
        <div className="text-xs text-muted mt-0.5">
          {loc.photos?.length || 0} 张照片
          {moods.length > 0 && ' · ' + moods.join('·')}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <button
          className="text-xs text-rose hover:underline"
          onClick={() => nav(`/trip/${loc.tripId}/location/${loc.id}/input`)}
        >
          编辑
        </button>
        {loc.generated && (
          <button
            className="text-xs text-muted hover:text-ink"
            onClick={() => nav(`/trip/${loc.tripId}/location/${loc.id}/preview`)}
          >
            预览
          </button>
        )}
        <button
          className="text-xs text-muted hover:text-rose"
          onClick={() => onDelete?.(loc)}
        >
          删除
        </button>
      </div>
    </div>
  )
}

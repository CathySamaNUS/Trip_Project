export default function MemorySpotCard({ spot, photoMap = {}, onEdit, onDelete }) {
  const photoCount = (spot.photoIds || []).length
  return (
    <div className="paper-card p-3 flex gap-3">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-ink truncate">📌 {spot.title || '小回忆点'}</div>
        {spot.shortText && (
          <div className="text-sm text-muted mt-1 line-clamp-2">{spot.shortText}</div>
        )}
        <div className="text-xs text-muted mt-2 flex flex-wrap gap-1.5">
          {photoCount > 0 && <span>📷 {photoCount} 张</span>}
          {(spot.keepsakes || []).slice(0, 2).map((k) => (
            <span key={k} className="bg-cream px-2 py-0.5 rounded-full">{k}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <button onClick={onEdit} className="text-xs text-rose hover:underline">编辑</button>
        <button onClick={onDelete} className="text-xs text-muted hover:text-rose">删除</button>
      </div>
    </div>
  )
}

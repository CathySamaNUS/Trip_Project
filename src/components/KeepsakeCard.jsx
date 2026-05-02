export default function KeepsakeCard({ name, emoji = '🌿', description }) {
  return (
    <div className="paper-card p-3 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-xl">
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-ink truncate">{name}</div>
        {description && <div className="text-xs text-muted mt-0.5 truncate">{description}</div>}
      </div>
    </div>
  )
}

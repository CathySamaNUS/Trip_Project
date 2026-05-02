export default function StickerTag({
  label,
  active = false,
  variant = 'default',
  onClick,
  removable = false,
  onRemove,
  className = ''
}) {
  const base =
    variant === 'mood'
      ? active ? 'sticker sticker-mood-active' : 'sticker sticker-mood'
      : active ? 'sticker sticker-active' : 'sticker sticker-default'
  return (
    <span className={`${base} ${className}`} onClick={onClick}>
      <span>{label}</span>
      {active && variant === 'default' && <span className="ml-1 text-xs">✓</span>}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className="ml-2 text-xs opacity-70 hover:opacity-100"
        >
          ✕
        </button>
      )}
    </span>
  )
}

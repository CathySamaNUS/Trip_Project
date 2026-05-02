import { useState } from 'react'

export default function CollapsiblePanel({ title, hint, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="paper-card p-4 mb-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between"
      >
        <div className="text-left">
          <div className="font-medium text-ink">{title}</div>
          {hint && <div className="text-xs text-muted mt-0.5">{hint}</div>}
        </div>
        <span className={`text-muted transition ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  )
}
